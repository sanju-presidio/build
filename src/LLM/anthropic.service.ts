import Anthropic from "@anthropic-ai/sdk";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { LLMProviderService } from "./provider.base";

import "dotenv/config";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
import {
  ClickAction,
  CompleteTaskAction,
  KeyPressAction,
  LaunchAction,
  ScrollAction,
  TypeAction,
} from "../tools/tools";
import { getSystemPrompt } from "../prompts/system.prompt";
import { EnvironmentConfig } from "../interfaces/environment.config";

type TextBlock = {
  type: "text";
  text: string;
};

type ImageBlock = {
  type: "image";
  source: {
    type: "base64";
    media_type: "image/png";
    data: string;
  };
};

type ContentBlock = TextBlock | ImageBlock;

export class AnthropicService extends LLMProviderService {
  environmentConfig!: EnvironmentConfig;
  anthropic!: Anthropic;
  bedrock!: BedrockRuntimeClient;
  useBedrock!: boolean;

  constructor() {
    super();
    this.createInstances({
      apiKey: process.env.ANTHROPIC_API_KEY as string,
      useBedrock: process.env.USE_BEDROCK === "true",
      AWS_REGION: process.env.AWS_REGION as string,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
    });
  }

  createInstances(config: {
    apiKey: string;
    useBedrock: boolean;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }) {
    this.useBedrock = config.useBedrock;
    if (!config.useBedrock) {
      this.anthropic = new Anthropic({
        apiKey: config.apiKey,
      });
    } else {
      this.bedrock = new BedrockRuntimeClient({
        region: config.AWS_REGION || "us-west-2",
        credentials: {
          accessKeyId: config.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY || "",
        },
      });
    }
  }

  setEnvironmentConfig(environmentConfig: EnvironmentConfig) {
    this.environmentConfig = environmentConfig;
    this.createInstances({
      apiKey: environmentConfig.ANTHROPIC_API_KEY as string,
      useBedrock: environmentConfig.USE_BEDROCK as boolean,
      AWS_REGION: environmentConfig.AWS_REGION as string,
      AWS_ACCESS_KEY_ID: environmentConfig.AWS_ACCESS_KEY_ID as string,
      AWS_SECRET_ACCESS_KEY: environmentConfig.AWS_SECRET_ACCESS_KEY as string,
    });
  }

  async performTask(
    source: StreamingSource,
    history: any[],
    originalImage?: string,
    elements?: IClickableElement[],
    model: string = "anthropic.claude-3-5-sonnet-20241022-v2:0",
    retryCount: number = 3,
  ): Promise<Array<any>> {
    try {
      const messages = this.constructMessage(
        source,
        history,
        originalImage,
        elements,
      );
      let actionResponse: Array<any>;
      if (!this.useBedrock) {
        actionResponse = await this.anthropicProvider(messages, model);
      } else {
        actionResponse = await this.bedrockProvider(messages, model);
      }
      return this.transform(actionResponse);
    } catch (error) {
      console.error("Error performing task:", error);
      retryCount--;
      if (retryCount > 0) {
        return await this.performTask(
          source,
          history,
          originalImage,
          elements,
          model,
        );
      } else {
        throw new Error("Failed to perform task");
      }
    }
  }

  constructMessage(
    source: StreamingSource,
    history: any[],
    originalImage?: string,
    elements?: IClickableElement[],
  ): Array<any> {
    const content: ContentBlock[] = [
      {
        type: "text",
        text: getSystemPrompt(source, elements || []),
      },
    ];

    if (originalImage) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: originalImage.replace(/^data:image\/png;base64,/, ""),
        },
      });
    }

    return [
      {
        role: "user" as const,
        content: content,
      },
      ...history,
    ];
  }

  async bedrockProvider(messages: any, model: string): Promise<Array<any>> {
    const input = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: messages.map(
        (msg: { role: string; content?: string; message?: string }) => ({
          role: msg.role,
          content: msg.content ?? msg.message,
        }),
      ),
      tools: [
        new LaunchAction().getToolSchema(),
        new ClickAction().getToolSchema(),
        new TypeAction().getToolSchema(),
        new KeyPressAction().getToolSchema(),
        new ScrollAction().getToolSchema(),
        new CompleteTaskAction().getToolSchema(),
      ],
    };

    const command = new InvokeModelCommand({
      modelId: model,
      body: JSON.stringify(input),
      contentType: "application/json",
    });

    const response = await this.bedrock.send(command);
    return JSON.parse(new TextDecoder().decode(response.body)).content;
  }

  async anthropicProvider(messages: any[], model: string): Promise<Array<any>> {
    const response = await this.anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages,
    });
    if (response.content[0].type === "text") {
      return [response.content[0].text];
    }
    throw new Error("Unexpected response type from Anthropic API");
  }

  transform(toolResponse: Array<any>) {
    return toolResponse.map((tool) => {
      if (tool.type === "text") {
        return {
          type: "text",
          text: tool.text,
        };
      } else if (tool.type === "tool_use") {
        return {
          type: "tool_use",
          toolName: tool.name,
          toolArgs: tool.input,
        };
      }
    });
  }
}
