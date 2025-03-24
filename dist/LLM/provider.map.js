"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const app_enum_1 = require("../interfaces/app.enum");
const anthropic_service_1 = require("./anthropic.service");
const openai_service_1 = require("./openai.service");
class ProviderService {
    constructor() {
        this.anthropic = new anthropic_service_1.AnthropicService();
        this.openai = new openai_service_1.OpenAIProvider();
    }
    getProviderInstance(provider) {
        switch (provider) {
            case app_enum_1.LLMProviders.OPENAI:
                return this.openai;
            case app_enum_1.LLMProviders.ANTHROPIC:
                return this.anthropic;
        }
    }
}
exports.ProviderService = ProviderService;
