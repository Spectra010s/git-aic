#!/usr/bin/env node

import { Command } from "commander";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import chalk from "chalk";
import { getGitDiff } from "./git.js";
import { generateCommitMessage } from "./llm.js";

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

    console.log(chalk.blue("Analyzing staged changes...\n"));
    const message = await generateCommitMessage(diff);

    console.log(chalk.green("Commit message generated:\n"));
    console.log(chalk.green(`"${message}"\n`));

    console.log(chalk.blue(`> ran: git commit -m "${message}"`));
    await git.commit(message);
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
