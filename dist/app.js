"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactifApp = void 0;
const uuid_1 = require("uuid");
const app_enum_1 = require("./interfaces/app.enum");
const puppeteer_service_1 = require("./sources/puppeteer.service");
const provider_map_1 = require("./LLM/provider.map");
const format_output_util_1 = require("./utils/format-output.util");
class FactifApp {
    constructor(loadConfig) {
        this.testOutput = {
            id: (0, uuid_1.v4)(),
            name: "",
            description: "",
            status: app_enum_1.TestcaseStatus.SKIPPED,
            conversation: [],
            screenshots: [],
            console: {
                logs: [],
                requests: [],
            },
        };
        this.providerService = new provider_map_1.ProviderService();
        this.sourceObject = new puppeteer_service_1.PlaywrightService();
        this.sourceObject.setBrowserEventsCallback(this.captureBrowserEvents.bind(this));
        this.environmentConfig = loadConfig;
        console.log("app =>", this.environmentConfig.MODEL);
    }
    async run(task) {
        this.testOutput.name = `${task}`;
        let history = [
            {
                role: "user",
                message: task,
            },
        ];
        const provider = this.providerService.getProviderInstance(app_enum_1.LLMProviders[this.environmentConfig.MODEL.toUpperCase()]);
        if (!provider) {
            throw new Error(`No provider found for ${app_enum_1.LLMProviders[this.environmentConfig.MODEL.toUpperCase()]}`);
        }
        try {
            await this.executeTask(this.sourceObject, provider, history);
            this.sourceObject.destroy();
            return this.testOutput;
        }
        catch (e) {
            console.error(e);
        }
    }
    captureBrowserEvents(event, payload) {
        event === "console"
            ? this.testOutput.console.logs.push(payload)
            : this.testOutput.console.requests.push(payload);
    }
    async executeTask(sourceObject, provider, history) {
        console.log("========================= iteration begin ======================");
        const currentState = await sourceObject.getCurrentStateDetails();
        const response = await provider.performTask(app_enum_1.StreamingSource.BROWSER, history, currentState === null || currentState === void 0 ? void 0 : currentState.originalImage, currentState === null || currentState === void 0 ? void 0 : currentState.inference);
        const actionResponse = await this.processLLMResponse(response, sourceObject, history);
        console.log(actionResponse);
        history = actionResponse.history;
        if (currentState === null || currentState === void 0 ? void 0 : currentState.originalImage) {
            this.testOutput.screenshots.push((0, format_output_util_1.constructScreenshotOutput)((0, uuid_1.v4)(), `data:image/png;base64,${currentState.originalImage}`));
        }
        if (!actionResponse.isTaskComplete) {
            console.log("========================= iteration end ======================");
            return this.executeTask(sourceObject, provider, history);
        }
        else {
            return history;
        }
    }
    async processLLMResponse(response, sourceObject, history) {
        let actionResponse = "";
        let isTaskComplete = false;
        let previousMessages = [];
        for (let content of response) {
            console.log(content);
            if (content.type === "text") {
                previousMessages.push({
                    role: "assistant",
                    content: content.text,
                });
            }
            else if (content.type === "tool_use") {
                if (content.toolName === "completeTask") {
                    actionResponse = `${content.toolArgs.result}`;
                    isTaskComplete = true;
                    this.testOutput = this.onTaskComplete(content.toolArgs, [...history, ...previousMessages], this.testOutput);
                }
                else {
                    console.log("===>", content.toolName, content.toolArgs);
                    actionResponse = await sourceObject[content.toolName].call(sourceObject, content.toolArgs);
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
    onTaskComplete(content, history, testOutput) {
        testOutput.conversation = (0, format_output_util_1.constructConversation)(history);
        testOutput.status = content.status;
        testOutput.description = content.result;
        return testOutput;
    }
}
exports.FactifApp = FactifApp;
