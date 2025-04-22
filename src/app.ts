import { v4 as uuid } from "uuid";

import {
  LLMProviders,
  StreamingSource,
  TestcaseStatus,
} from "./interfaces/app.enum";
import { ITestOutput } from "./interfaces/test-output.interface";

import { PlaywrightService } from "./sources/puppeteer.service";
import { ProviderService } from "./LLM/provider.map";
import {
  constructConversation,
  constructScreenshotOutput,
} from "./utils/format-output.util";
import { BrowserInferenceData } from "./interfaces/app.interface";
import { EnvironmentConfig } from "./interfaces/environment.config";

export class FactifApp {
  providerService: ProviderService;
  sourceObject: PlaywrightService;
  testOutput: ITestOutput = {
    id: uuid(),
    name: "",
    description: "",
    status: TestcaseStatus.SKIPPED,
    conversation: [],
    screenshots: [],
    console: {
      logs: [],
      requests: [],
    },
  };

  environmentConfig: EnvironmentConfig;

  constructor(loadConfig: EnvironmentConfig) {
    this.providerService = new ProviderService();
    this.sourceObject = new PlaywrightService();
    PlaywrightService.setInstance(this.sourceObject)
    this.sourceObject.setBrowserEventsCallback(
      this.captureBrowserEvents.bind(this),
    );
    this.environmentConfig = { ...loadConfig };
    console.log("app =>", this.environmentConfig.MODEL);
  }

  async run(task: string) {
    this.testOutput.name = `${task}`;
    let history: any[] = [
      {
        role: "user",
        message: task,
      },
    ];

    const provider = this.providerService.getProviderInstance(
      LLMProviders[
        this.environmentConfig.MODEL.toUpperCase() as keyof typeof LLMProviders
      ],
      this.environmentConfig,
    );
    if (!provider) {
      throw new Error(
        `No provider found for ${LLMProviders[this.environmentConfig.MODEL.toUpperCase() as keyof typeof LLMProviders]}`,
      );
    }
    try {
      await this.executeTask(this.sourceObject, provider, history);
      this.sourceObject.destroy();
      provider.destroy();
      return this.testOutput;
    } catch (e) {
      console.error(e);
    }
  }

  captureBrowserEvents(event: string, payload: any) {
    event === "console"
      ? this.testOutput.console.logs.push(payload)
      : this.testOutput.console.requests.push(payload);
  }

  async executeTask(
    sourceObject: any,
    provider: any,
    history: any[],
  ): Promise<any> {
    console.log(
      "========================= iteration begin ======================",
    );
    const currentState: BrowserInferenceData =
      await sourceObject.getCurrentStateDetails();

    const response = await provider.performTask(
      StreamingSource.BROWSER,
      history,
      currentState?.originalImage,
      currentState?.inference,
    );
    const actionResponse = await this.processLLMResponse(
      response,
      sourceObject,
      history,
    );
    console.log(actionResponse);
    history = actionResponse.history;

    if (currentState?.originalImage) {
      this.testOutput.screenshots.push(
        constructScreenshotOutput(
          uuid(),
          `data:image/png;base64,${currentState.originalImage}`,
        ),
      );
    }
    if (!actionResponse.isTaskComplete) {
      console.log(
        "========================= iteration end ======================",
      );
      return this.executeTask(sourceObject, provider, history);
    } else {
      return history;
    }
  }

  async processLLMResponse(
    response: Array<any>,
    sourceObject: PlaywrightService,
    history: { role: string; message?: string; content?: string }[],
  ): Promise<{
    history: { role: string; message?: string; content?: string }[];
    isTaskComplete: boolean;
  }> {
    let actionResponse = "";
    let isTaskComplete = false;
    let previousMessages: { role: string; content: string }[] = [];
    for (let content of response) {
      console.log(content);
      if (content.type === "text") {
        previousMessages.push({
          role: "assistant",
          content: content.text,
        });
      } else if (content.type === "tool_use") {
        if (content.toolName === "completeTask") {
          actionResponse = `${content.toolArgs.result}`;
          isTaskComplete = true;
          this.testOutput = this.onTaskComplete(
            content.toolArgs,
            [...history, ...previousMessages],
            this.testOutput,
          );
        } else {
          console.log("===>", content.toolName, content.toolArgs);
          actionResponse = await (sourceObject as any)[content.toolName].call(
            sourceObject,
            content.toolArgs,
          );
        }
        previousMessages.forEach((message) => history.push(message));
        history.push({
          role: "user",
          message: actionResponse,
        });
      }
    }
    return { history, isTaskComplete };
  }

  onTaskComplete(
    content: any,
    history: { role: string; message?: string; content?: string }[],
    testOutput: ITestOutput,
  ) {
    testOutput.conversation = constructConversation(history);
    testOutput.status = content.status;
    testOutput.description = content.result;
    return testOutput;
  }

  destroyInstance() {}
}
