import { LLMProviders, TestcaseStatus } from "../interfaces/app.enum";
import { FactifApp } from "../app";
import { getTestCases } from "./feeder.service";
import { ITestSummary } from "../interfaces/test-output.interface";

async function startTesting() {
  const taskOutput: ITestSummary = {
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
    tests: [],
  };

  const testcases = (await getTestCases()) || [];
  for (let testcase of testcases) {
    const app = new FactifApp({
      MODEL: LLMProviders.ANTHROPIC,
      USE_BEDROCK: "true",
      AWS_REGION: "us-west-2",
      AWS_ACCESS_KEY_ID: "AKIAWOHVYJJQE4FKQZV4",
      AWS_SECRET_ACCESS_KEY: "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",
    });
    console.log(app);
    const output = await app.run(testcase);
    output && taskOutput.tests.push(output);
    output?.status === TestcaseStatus.SUCCESS
      ? taskOutput.summary.passed++
      : taskOutput.summary.failed++;
  }
  return taskOutput;
}

startTesting().then((res) => {
  console.log(res);
});
