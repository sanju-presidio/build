import OpenAI, { AzureOpenAI } from "openai";
import { LLMProviderService } from "./provider.base";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
import { getSystemPrompt } from "../prompts/system.prompt";
import {
  ClickAction,
  CompleteTaskAction,
  KeyPressAction,
  LaunchAction,
  ScrollAction,
  TypeAction,
} from "../tools/tools";
import { ChatCompletion } from "openai/src/resources/chat/completions/completions";
import { EnvironmentConfig } from "../interfaces/environment.config";

export class OpenAIProvider extends LLMProviderService {
  private openai!: OpenAI | AzureOpenAI;
  environmentConfig!: EnvironmentConfig;
  constructor() {
    super();
    process.env.OPENAI_API_KEY &&
      this.createInstances({
        apiKey: process.env.OPENAI_API_KEY as string,
      });
  }

  createInstances(config: { apiKey: string }) {
    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  setEnvironmentConfig(environmentConfig: EnvironmentConfig) {
    this.environmentConfig = environmentConfig;
    this.createInstances({
      apiKey: environmentConfig.OPENAI_API_KEY as string,
    });
  }

  async performTask(
    source: StreamingSource,
    history: any[],
    originalImage?: string,
    elements?: IClickableElement[],
    model: string = "gpt-4o",
    retryCount: number = 3,
  ): Promise<Array<any>> {
    try {
      const messages = this.constructMessage(
        source,
        history,
        originalImage,
        elements,
      );
      const response = await this.openaiProvider(messages, model);
      return this.transform(response);
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
          retryCount,
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
  ) {
    const content = [
      {
        type: "text",
        text: getSystemPrompt(source, elements || []),
      },
    ];

    if (originalImage) {
      content.push({
        type: "image_url",
        //@ts-ignore
        image_url: {
          url: `data:image/png;base64,${originalImage}`,
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

  async openaiProvider(messages: any[], model: string): Promise<any[]> {
    const completion: ChatCompletion =
      //@ts-ignore
      await this.openai.chat.completions.create({
        model: model,
        messages: messages.map(
          (msg: { role: string; content?: string; message?: string }) => ({
            role: msg.role,
            content: msg.content ?? msg.message,
          }),
        ),
        tools: [
          new LaunchAction().getOpenAISchema(),
          new ClickAction().getOpenAISchema(),
          new TypeAction().getOpenAISchema(),
          new KeyPressAction().getOpenAISchema(),
          new ScrollAction().getOpenAISchema(),
          new CompleteTaskAction().getOpenAISchema(),
        ],
        tool_choice: "auto",
      });
    return completion.choices[0].message.tool_calls as any[];
  }

  transform(toolResponse: Array<any>) {
    console.log("Available tool on response:", toolResponse);
    return toolResponse.map((tool) => {
      if (tool.type === "text") {
        return {
          type: "text",
          text: tool.text,
        };
      } else if (tool.type === "function") {
        return {
          type: "tool_use",
          toolName: tool.function.name,
          toolArgs: JSON.parse(tool.function.arguments),
        };
      }
    });
  }
}
