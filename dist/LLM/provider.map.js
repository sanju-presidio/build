"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const app_enum_1 = require("../interfaces/app.enum");
const anthropic_service_1 = require("./anthropic.service");
const openai_service_1 = require("./openai.service");
class ProviderService {
    constructor() { }
    getProviderInstance(provider, environmentConfig) {
        console.log(provider, environmentConfig);
        switch (provider) {
            case app_enum_1.LLMProviders.OPENAI:
                this.openai = new openai_service_1.OpenAIProvider();
                environmentConfig &&
                    this.openai.setEnvironmentConfig(environmentConfig);
                return this.openai;
            case app_enum_1.LLMProviders.ANTHROPIC:
                this.anthropic = new anthropic_service_1.AnthropicService();
                environmentConfig &&
                    this.anthropic.setEnvironmentConfig(environmentConfig);
                return this.anthropic;
        }
    }
}
exports.ProviderService = ProviderService;
