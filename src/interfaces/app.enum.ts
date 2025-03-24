export enum StreamingSource {
  BROWSER,
  DESKTOP,
}

export enum LLMProviders {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  GEMINI = "gemini",
}

export type ActionType =
  | "click"
  | "type"
  | "scroll_up"
  | "scroll_down"
  | "launch"
  | "back"
  | "doubleClick"
  | "keyPress";

export enum UserRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export enum TestcaseStatus {
  PASSED = "passed",
  FAILED = "failed",
  SKIPPED = "skipped",
  SUCCESS = "success",
  FAILURE = "failure",
}
