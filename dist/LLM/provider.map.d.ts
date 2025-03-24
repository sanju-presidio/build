import { LLMProviders } from "../interfaces/app.enum";
import { AnthropicService } from "./anthropic.service";
import { OpenAIProvider } from "./openai.service";
export declare class ProviderService {
    private anthropic;
    private openai;
    constructor();
    getProviderInstance(provider: LLMProviders): AnthropicService | OpenAIProvider | undefined;
}
