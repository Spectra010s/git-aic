#!/usr/bin/env node

import { Command } from "commander";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import chalk from "chalk";
import { getGitDiff } from "./git.js";
import { generateCommitMessage } from "./llm.js";
import { getConfig, setApiKey } from "./config.js";

const git: SimpleGit = simpleGit();
const program = new Command();

program
  .name("git aic")
  .description("AI-powered Git commit generator using Google Gemini")
  .version("1.0.0")
  .option("-p, --push", "push after committing");

program
  .command("config")
  .description("Configure the Gemini API Key settings")
  .option("-k, --key <key>", "Set your Gemini API Key")
  .option("--show", "Show the full API key")
  .action(async (options) => {
    const cfg = await getConfig();
    if (options.key) {
      await setApiKey(options.key);
      console.log(chalk.green("API Key saved successfully!"));
      return;
    }
    if (cfg.apiKey) {
      if (options.show) {
        console.log(chalk.green("Current API Key:"), cfg.apiKey);
      } else {
        const styled =
          cfg.apiKey.slice(0, 4) +
          chalk.dim("*".repeat(cfg.apiKey.length - 8)) +
          cfg.apiKey.slice(-4);
        console.log(chalk.green("Current API Key:"), styled);
      }
    } else {
      console.log(chalk.yellow("No API key set"));
    }
  });

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
