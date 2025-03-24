"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_enum_1 = require("../interfaces/app.enum");
const app_1 = require("../app");
const feeder_service_1 = require("./feeder.service");
async function startTesting() {
    const taskOutput = {
        summary: {
            passed: 0,
            failed: 0,
            total: 0,
        },
        tests: [],
    };
    const testcases = (await (0, feeder_service_1.getTestCases)()) || [];
    for (let testcase of testcases) {
        const app = new app_1.FactifApp({
            MODEL: app_enum_1.LLMProviders.ANTHROPIC,
            USE_BEDROCK: "true",
            AWS_REGION: "us-west-2",
            AWS_ACCESS_KEY_ID: "AKIAWOHVYJJQE4FKQZV4",
            AWS_SECRET_ACCESS_KEY: "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",
        });
        console.log(app);
        const output = await app.run(testcase);
        output && taskOutput.tests.push(output);
        (output === null || output === void 0 ? void 0 : output.status) === app_enum_1.TestcaseStatus.SUCCESS
            ? taskOutput.summary.passed++
            : taskOutput.summary.failed++;
    }
    return taskOutput;
}
startTesting().then((res) => {
    console.log(res);
});
