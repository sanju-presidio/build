import { LLMProviders } from "../interfaces/app.enum";
import { AnthropicService } from "./anthropic.service";
import { OpenAIProvider } from "./openai.service";
import { EnvironmentConfig } from "../interfaces/environment.config";

export class ProviderService {
  private anthropic!: AnthropicService;
  private openai!: OpenAIProvider;

  constructor() {}

  getProviderInstance(
    provider: LLMProviders,
    environmentConfig?: EnvironmentConfig,
  ) {
    console.log(provider, environmentConfig);
    switch (provider) {
      case LLMProviders.OPENAI:
        this.openai = new OpenAIProvider();
        environmentConfig &&
          this.openai.setEnvironmentConfig(environmentConfig);
        return this.openai;
      case LLMProviders.ANTHROPIC:
        this.anthropic = new AnthropicService();
        environmentConfig &&
          this.anthropic.setEnvironmentConfig(environmentConfig);
        return this.anthropic;
    }
  }
}
