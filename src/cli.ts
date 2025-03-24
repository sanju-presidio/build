import { main } from "./main";

import { Command } from "commander";
const program = new Command();

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
  .action(
    async (options: {
      env: string;
      inputFile: string;
      outputPath: string;
      task: string;
    }) => {
      console.log(options);
      main(
        options.env,
        options.inputFile,
        options.task,
        options.outputPath,
      ).then();
    },
  );

program.parse();
