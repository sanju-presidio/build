import { LLMProviders } from "../interfaces/app.enum";
import { AnthropicService } from "./anthropic.service";
import { OpenAIProvider } from "./openai.service";
import { EnvironmentConfig } from "../interfaces/environment.config";
export declare class ProviderService {
    private anthropic;
    private openai;
    constructor();
    getProviderInstance(provider: LLMProviders, environmentConfig?: EnvironmentConfig): AnthropicService | OpenAIProvider | undefined;
}
