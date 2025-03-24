"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
const provider_base_1 = require("./provider.base");
const system_prompt_1 = require("../prompts/system.prompt");
const tools_1 = require("../tools/tools");
class OpenAIProvider extends provider_base_1.LLMProviderService {
    constructor() {
        super();
        process.env.OPENAI_API_KEY &&
            this.createInstances({
                apiKey: process.env.OPENAI_API_KEY,
            });
    }
    createInstances(config) {
        this.openai = new openai_1.default({
            apiKey: config.apiKey,
        });
    }
    setEnvironmentConfig(environmentConfig) {
        this.environmentConfig = environmentConfig;
        this.createInstances({
            apiKey: environmentConfig.OPENAI_API_KEY,
        });
    }
    async performTask(source, history, originalImage, elements, model = "gpt-4o", retryCount = 3) {
        try {
            const messages = this.constructMessage(source, history, originalImage, elements);
            const response = await this.openaiProvider(messages, model);
            return this.transform(response);
        }
        catch (error) {
            console.error("Error performing task:", error);
            retryCount--;
            if (retryCount > 0) {
                return await this.performTask(source, history, originalImage, elements, model, retryCount);
            }
            else {
                throw new Error("Failed to perform task");
            }
        }
    }
    constructMessage(source, history, originalImage, elements) {
        const content = [
            {
                type: "text",
                text: (0, system_prompt_1.getSystemPrompt)(source, elements || []),
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
                role: "user",
                content: content,
            },
            ...history,
        ];
    }
    async openaiProvider(messages, model) {
        const completion = 
        //@ts-ignore
        await this.openai.chat.completions.create({
            model: model,
            messages: messages.map((msg) => {
                var _a;
                return ({
                    role: msg.role,
                    content: (_a = msg.content) !== null && _a !== void 0 ? _a : msg.message,
                });
            }),
            tools: [
                new tools_1.LaunchAction().getOpenAISchema(),
                new tools_1.ClickAction().getOpenAISchema(),
                new tools_1.TypeAction().getOpenAISchema(),
                new tools_1.KeyPressAction().getOpenAISchema(),
                new tools_1.ScrollAction().getOpenAISchema(),
                new tools_1.CompleteTaskAction().getOpenAISchema(),
            ],
            tool_choice: "auto",
        });
        return completion.choices[0].message.tool_calls;
    }
    transform(toolResponse) {
        console.log("Available tool on response:", toolResponse);
        return toolResponse.map((tool) => {
            if (tool.type === "text") {
                return {
                    type: "text",
                    text: tool.text,
                };
            }
            else if (tool.type === "function") {
                return {
                    type: "tool_use",
                    toolName: tool.function.name,
                    toolArgs: JSON.parse(tool.function.arguments),
                };
            }
        });
    }
}
exports.OpenAIProvider = OpenAIProvider;
