"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestcaseStatus = exports.UserRole = exports.LLMProviders = exports.StreamingSource = void 0;
var StreamingSource;
(function (StreamingSource) {
    StreamingSource[StreamingSource["BROWSER"] = 0] = "BROWSER";
    StreamingSource[StreamingSource["DESKTOP"] = 1] = "DESKTOP";
})(StreamingSource || (exports.StreamingSource = StreamingSource = {}));
var LLMProviders;
(function (LLMProviders) {
    LLMProviders["OPENAI"] = "openai";
    LLMProviders["ANTHROPIC"] = "anthropic";
    LLMProviders["GEMINI"] = "gemini";
})(LLMProviders || (exports.LLMProviders = LLMProviders = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ASSISTANT"] = "assistant";
})(UserRole || (exports.UserRole = UserRole = {}));
var TestcaseStatus;
(function (TestcaseStatus) {
    TestcaseStatus["PASSED"] = "passed";
    TestcaseStatus["FAILED"] = "failed";
    TestcaseStatus["SKIPPED"] = "skipped";
    TestcaseStatus["SUCCESS"] = "success";
    TestcaseStatus["FAILURE"] = "failure";
})(TestcaseStatus || (exports.TestcaseStatus = TestcaseStatus = {}));
