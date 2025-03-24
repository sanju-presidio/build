"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name("factifai")
    .description("CLI of factifai application")
    .version("1.0.0");
program
    .command("factifai")
    .description("Split a string into substrings and display as an array")
    .option("-i, --input-file <string>", "Input ./sample.json")
    .option("-o, --output-path <string>", "output ./location")
    .option("-t, --task <string>", "task ./location")
    .option("--env <string>", "env ./path")
    .action(async (options) => {
    console.log(options);
    (0, main_1.main)(options.env, options.inputFile, options.task, options.outputPath).then();
});
program.parse();
