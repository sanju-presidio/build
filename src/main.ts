import { FactifApp } from "./app";
import fs from "fs";
import { ITestSummary } from "./interfaces/test-output.interface";
import { LLMProviders, TestcaseStatus } from "./interfaces/app.enum";
import * as path from "node:path";
import dotenv from "dotenv";

export async function main(
  envFilePath: string,
  inputFilePath?: string,
  task?: string,
  outputFilePath: string = "./output",
) {
  const taskOutput: ITestSummary = {
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
    tests: [],
  };
  dotenv.config({
    path: `${envFilePath}/.env`,
  });

  let taskList = [];
  if (inputFilePath) {
    taskList = await readInputFile(inputFilePath);
  } else if (task) {
    taskList = [task];
  } else {
    throw new Error("No task provided");
  }
  await startTesting(taskList, taskOutput);
  writeOutputFile(outputFilePath, taskOutput);
  writeHtmlOutput(outputFilePath, taskOutput);
}

const startTesting = async (taskList: string[], taskOutput: ITestSummary) => {
  taskOutput.summary.total = taskList.length;
  for (const task of taskList) {
    const app = new FactifApp({ MODEL: LLMProviders.ANTHROPIC });
    const output = await app.run(task);
    output && taskOutput.tests.push(output);
    output?.status === TestcaseStatus.SUCCESS
      ? taskOutput.summary.passed++
      : taskOutput.summary.failed++;
  }
  return taskOutput;
};

const readInputFile = (inputFilePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFilePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(data);
      resolve(JSON.parse(data).testcases);
    });
  });
};

const writeOutputFile = (outputFilePath: string, taskOutput: ITestSummary) => {
  try {
    const outputFile = `${outputFilePath}/test-result.json`;
    if (!fs.existsSync(outputFilePath)) {
      fs.mkdirSync(outputFilePath, { recursive: true });
    }
    fs.writeFileSync(outputFile, JSON.stringify(taskOutput));
  } catch (e) {
    console.error(e);
  }
};

const writeHtmlOutput = (outputFilePath: string, taskOutput: ITestSummary) => {
  try {
    console.log(path.resolve(__dirname, "output-template.html"));
    const outputTemplate = fs.readFileSync(
      path.resolve(__dirname, "output-template.html"),
      {
        encoding: "utf8",
        flag: "r",
      },
    );
    const newTemplate = outputTemplate.replace(
      "###JSON_DATA###",
      JSON.stringify(taskOutput),
    );
    fs.writeFileSync(`${outputFilePath}/index.html`, newTemplate);
  } catch (e) {
    console.error(e);
  }
};
