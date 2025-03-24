export declare enum StreamingSource {
    BROWSER = 0,
    DESKTOP = 1
}
export declare enum LLMProviders {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    GEMINI = "gemini"
}
export type ActionType = "click" | "type" | "scroll_up" | "scroll_down" | "launch" | "back" | "doubleClick" | "keyPress";
export declare enum UserRole {
    USER = "user",
    ASSISTANT = "assistant"
}
export declare enum TestcaseStatus {
    PASSED = "passed",
    FAILED = "failed",
    SKIPPED = "skipped",
    SUCCESS = "success",
    FAILURE = "failure"
}
