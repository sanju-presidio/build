import { LLMProviders } from "./app.enum";

export interface EnvironmentConfig {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  USE_BEDROCK?: string;
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  ANTHROPIC_MODEL_NAME?: string;
  OPENAI_MODEL_NAME?: string;
  MODEL: LLMProviders;
}
