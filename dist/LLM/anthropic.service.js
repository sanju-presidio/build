"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const provider_base_1 = require("./provider.base");
require("dotenv/config");
const tools_1 = require("../tools/tools");
const system_prompt_1 = require("../prompts/system.prompt");
class AnthropicService extends provider_base_1.LLMProviderService {
    constructor() {
        super();
        this.createInstances({
            apiKey: process.env.ANTHROPIC_API_KEY,
            useBedrock: process.env.USE_BEDROCK === "true",
            AWS_REGION: process.env.AWS_REGION,
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    createInstances(config) {
        this.useBedrock = config.useBedrock;
        if (!config.useBedrock) {
            this.anthropic = new sdk_1.default({
                apiKey: config.apiKey,
            });
        }
        else {
            this.bedrock = new client_bedrock_runtime_1.BedrockRuntimeClient({
                region: config.AWS_REGION || "us-west-2",
                credentials: {
                    accessKeyId: config.AWS_ACCESS_KEY_ID || "",
                    secretAccessKey: config.AWS_SECRET_ACCESS_KEY || "",
                },
            });
        }
    }
    setEnvironmentConfig(environmentConfig) {
        this.environmentConfig = environmentConfig;
        this.createInstances({
            apiKey: environmentConfig.ANTHROPIC_API_KEY,
            useBedrock: environmentConfig.USE_BEDROCK,
            AWS_REGION: environmentConfig.AWS_REGION,
            AWS_ACCESS_KEY_ID: environmentConfig.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: environmentConfig.AWS_SECRET_ACCESS_KEY,
        });
    }
    async performTask(source, history, originalImage, elements, model = "anthropic.claude-3-5-sonnet-20241022-v2:0", retryCount = 3) {
        try {
            const messages = this.constructMessage(source, history, originalImage, elements);
            let actionResponse;
            if (!this.useBedrock) {
                actionResponse = await this.anthropicProvider(messages, model);
            }
            else {
                actionResponse = await this.bedrockProvider(messages, model);
            }
            return this.transform(actionResponse);
        }
        catch (error) {
            console.error("Error performing task:", error);
            retryCount--;
            if (retryCount > 0) {
                return await this.performTask(source, history, originalImage, elements, model);
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
                role: "user",
                content: content,
            },
            ...history,
        ];
    }
    async bedrockProvider(messages, model) {
        const input = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            messages: messages.map((msg) => {
                var _a;
                return ({
                    role: msg.role,
                    content: (_a = msg.content) !== null && _a !== void 0 ? _a : msg.message,
                });
            }),
            tools: [
                new tools_1.LaunchAction().getToolSchema(),
                new tools_1.ClickAction().getToolSchema(),
                new tools_1.TypeAction().getToolSchema(),
                new tools_1.KeyPressAction().getToolSchema(),
                new tools_1.ScrollAction().getToolSchema(),
                new tools_1.CompleteTaskAction().getToolSchema(),
            ],
        };
        const command = new client_bedrock_runtime_1.InvokeModelCommand({
            modelId: model,
            body: JSON.stringify(input),
            contentType: "application/json",
        });
        const response = await this.bedrock.send(command);
        return JSON.parse(new TextDecoder().decode(response.body)).content;
    }
    async anthropicProvider(messages, model) {
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
    transform(toolResponse) {
        return toolResponse.map((tool) => {
            if (tool.type === "text") {
                return {
                    type: "text",
                    text: tool.text,
                };
            }
            else if (tool.type === "tool_use") {
                return {
                    type: "tool_use",
                    toolName: tool.name,
                    toolArgs: tool.input,
                };
            }
        });
    }
}
exports.AnthropicService = AnthropicService;
