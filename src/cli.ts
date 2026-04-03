#!/usr/bin/env node

import fs from "fs/promises";
import { Command } from "commander";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import chalk from "chalk";
import { getGitDiff } from "./git.js";
import { generateCommitMessage } from "./llm.js";
import { getUserConfirmation } from "./confirm.js";
import { editPromptInEditor } from "./editor.js";
import {
  getConfig,
  resetCustomPrompt,
  setApiKey,
  setCustomPrompt,
} from "./config.js";
import { getLocalPrompt, resetLocalPrompt, setLocalPrompt } from "./git.js";
import { DEFAULT_SYSTEM_PROMPT } from "./prompt.js";

process.on("SIGINT", () => {
  process.exit(0);
});

const git: SimpleGit = simpleGit();
const program = new Command();

program
  .name("git aic")
  .description("AI-powered Git commit generator using Google Gemini")
  .version("1.0.0")
  .option("-p, --push", "push after committing")
  .option("-i, --issue <number>", "Link commit to GitHub issue");

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

const promptCommand = program
  .command("prompt")
  .description("Manage the system prompt used for commit generation");

promptCommand
  .command("edit")
  .description("Edit and save a custom system prompt in your editor")
  .option("--local", "Save the custom prompt in the current repository")
  .option("--global", "Save the custom prompt in the global git-aic config")
  .option("-t, --text <prompt>", "Set the custom prompt from a string")
  .option("-f, --file <path>", "Set the custom prompt from a file")
  .action(
    async (options: {
      local?: boolean;
      global?: boolean;
      text?: string;
      file?: string;
    }) => {
    try {
      const cfg = await getConfig();

      if (options.local && options.global) {
        console.log(
          chalk.red("Use either --local or --global, not both at the same time."),
        );
        process.exit(1);
      }

      if (options.text && options.file) {
        console.log(
          chalk.red("Use either --text or --file, not both at the same time."),
        );
        process.exit(1);
      }

      let editedPrompt = "";

      if (options.text) {
        editedPrompt = options.text.trim();
      } else if (options.file) {
        editedPrompt = (await fs.readFile(options.file, "utf-8")).trim();
      } else {
        const startingPrompt = options.local
          ? ((await getLocalPrompt()) ?? cfg.customPrompt ?? DEFAULT_SYSTEM_PROMPT)
          : (cfg.customPrompt ?? DEFAULT_SYSTEM_PROMPT);

        editedPrompt = await editPromptInEditor(
          startingPrompt,
        );
      }

      if (!editedPrompt) {
        console.log(chalk.red("Prompt was empty. Nothing saved."));
        process.exit(1);
      }

      if (options.local) {
        await setLocalPrompt(editedPrompt);
        console.log(chalk.green("Local system prompt saved successfully!"));
      } else {
        await setCustomPrompt(editedPrompt);
        console.log(chalk.green("Global system prompt saved successfully!"));
      }
    } catch (error) {
      console.error(chalk.red("Prompt edit failed:"), error);
      process.exit(1);
    }
    },
  );

promptCommand
  .command("reset")
  .description("Reset the system prompt back to the default")
  .option("--local", "Reset the prompt in the current repository")
  .option("--global", "Reset the prompt in the global git-aic config")
  .action(async (options: { local?: boolean; global?: boolean }) => {
    if (options.local && options.global) {
      console.log(
        chalk.red("Use either --local or --global, not both at the same time."),
      );
      process.exit(1);
    }

    if (options.local) {
      await resetLocalPrompt();
      console.log(chalk.green("Local system prompt reset to default."));
      return;
    }

    await resetCustomPrompt();
    console.log(chalk.green("Global system prompt reset to default."));
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

    let currentMsg = "";
    let confirmed = false;
    let finalMsg = "";

    const issueSuffix = options.issue ? `, closes #${options.issue}` : "";

    console.log(chalk.blue("Analyzing staged changes...\n"));

    while (!confirmed) {
      let currentMsg = await generateCommitMessage(diff);

      currentMsg = `${currentMsg}${issueSuffix}`;

      const { choice, message } = await getUserConfirmation(currentMsg);

      if (choice === "y") {
        finalMsg = message;
        confirmed = true;
      } else if (choice === "r") {
        console.log(chalk.yellow("Regenerating...\n"));
        continue;
      } else {
        console.log(chalk.red("Aborted."));
        process.exit(0);
      }
    }

    console.log(chalk.blue(`> ran: git commit -m "${finalMsg}"`));
    await git.commit(finalMsg);
    console.log(chalk.green("\nCommit successful"));

    if (options.push) {
      console.log(chalk.blue("> ran: git push"));
      await git.push();
      console.log(chalk.green("Push successful"));
    }
  } catch (error: unknown) {
    let isAbort = false;

    if (typeof error === "object" && error !== null && "code" in error) {
      const e = error as { code?: string };
      isAbort = e.code === "ABORT_ERR";
    }

    const msg = isAbort ? "Operation cancelled" : error;
    console.error(chalk.red("\n\nCommit failed:"), msg);
    process.exit(isAbort ? 0 : 1);
  }
});

program.parse(process.argv);
