"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const app_1 = require("./app");
const fs_1 = __importDefault(require("fs"));
const app_enum_1 = require("./interfaces/app.enum");
const path = __importStar(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
async function main(envFilePath, inputFilePath, task, outputFilePath = "./output") {
    const taskOutput = {
        summary: {
            passed: 0,
            failed: 0,
            total: 0,
        },
        tests: [],
    };
    dotenv_1.default.config({
        path: `${envFilePath}/.env`,
    });
    let taskList = [];
    if (inputFilePath) {
        taskList = await readInputFile(inputFilePath);
    }
    else if (task) {
        taskList = [task];
    }
    else {
        throw new Error("No task provided");
    }
    await startTesting(taskList, taskOutput);
    writeOutputFile(outputFilePath, taskOutput);
    writeHtmlOutput(outputFilePath, taskOutput);
}
const startTesting = async (taskList, taskOutput) => {
    taskOutput.summary.total = taskList.length;
    for (const task of taskList) {
        const app = new app_1.FactifApp({ MODEL: app_enum_1.LLMProviders.ANTHROPIC });
        const output = await app.run(task);
        output && taskOutput.tests.push(output);
        (output === null || output === void 0 ? void 0 : output.status) === app_enum_1.TestcaseStatus.SUCCESS
            ? taskOutput.summary.passed++
            : taskOutput.summary.failed++;
    }
    return taskOutput;
};
const readInputFile = (inputFilePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(inputFilePath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(data);
            resolve(JSON.parse(data).testcases);
        });
    });
};
const writeOutputFile = (outputFilePath, taskOutput) => {
    try {
        const outputFile = `${outputFilePath}/test-result.json`;
        if (!fs_1.default.existsSync(outputFilePath)) {
            fs_1.default.mkdirSync(outputFilePath, { recursive: true });
        }
        fs_1.default.writeFileSync(outputFile, JSON.stringify(taskOutput));
    }
    catch (e) {
        console.error(e);
    }
};
const writeHtmlOutput = (outputFilePath, taskOutput) => {
    try {
        console.log(path.resolve(__dirname, "output-template.html"));
        const outputTemplate = fs_1.default.readFileSync(path.resolve(__dirname, "output-template.html"), {
            encoding: "utf8",
            flag: "r",
        });
        const newTemplate = outputTemplate.replace("###JSON_DATA###", JSON.stringify(taskOutput));
        fs_1.default.writeFileSync(`${outputFilePath}/index.html`, newTemplate);
    }
    catch (e) {
        console.error(e);
    }
};
