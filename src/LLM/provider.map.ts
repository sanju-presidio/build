import { LLMProviders } from "../interfaces/app.enum";
import { AnthropicService } from "./anthropic.service";
import { OpenAIProvider } from "./openai.service";

export class ProviderService {
  private anthropic: AnthropicService = new AnthropicService();
  private openai: OpenAIProvider = new OpenAIProvider();

  constructor() {}

  getProviderInstance(provider: LLMProviders) {
    switch (provider) {
      case LLMProviders.OPENAI:
        return this.openai;
      case LLMProviders.ANTHROPIC:
        return this.anthropic;
    }
  }
}
