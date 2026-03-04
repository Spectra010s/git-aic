#!/usr/bin/env node

import { Command } from "commander";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import chalk from "chalk";
import { getGitDiff } from "./git.js";
import { generateCommitMessage } from "./llm.js";
import { getUserConfirmation } from "./confirm.js"

const git: SimpleGit = simpleGit();
const program = new Command();

program
  .name("commit")
  .description("AI-powered Git commit generator using Google Gemini")
  .version("1.0.0")
  .option("-p, --push", "push after committing");

program.action(async (options) => {
  try {
    const diff = await getGitDiff();
    if (!diff) {
      console.log(chalk.yellow("No changes to commit!"));
      process.exit(0);
    }

    const status = await git.status();
    console.log(chalk.blue("\nFiles being committed:"));
    status.staged.forEach((file) => console.log(chalk.cyan(`- ${file}`)));
    console.log("");

    let currentMessage = "";
    let confirmed = false;

    
    while (!confirmed) {
      console.log(chalk.blue("Analyzing staged changes...\n"));
      currentMessage = await generateCommitMessage(diff);
     
      const { choice, message } = await getUserConfirmation(currentMessage);

      if (choice === 'y') {
        currentMessage = message;
        confirmed = true;
      } else if (choice === 'r') {
        console.log(chalk.yellow("Regenerating..."));
        continue;
      } else {
        console.log(chalk.red("Aborted."));
        process.exit(0);
      }
    }
    
    console.log(chalk.blue(`> ran: git commit -m "${currentMessage}"`));
    await git.commit(currentMessage);
    console.log(chalk.green("\nCommit successful"));

    if (options.push) {
      console.log(chalk.blue("> ran: git push"));
      await git.push();
      console.log(chalk.green("Push successful"));
    }
  } catch (error) {
    console.error(chalk.red("Commit failed:"), error);
    process.exit(1);
  }
});

program.parse(process.argv);
