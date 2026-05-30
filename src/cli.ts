#!/usr/bin/env node

import fs from "fs/promises";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import chalk from "chalk";
import {
  ensureInsideGitRepo,
  getGitDiff,
  getLocalPrompt,
  resetLocalPrompt,
  setLocalPrompt,
} from "./git.js";
import { generateCommitMessage } from "./llm.js";
import { getUserConfirmation } from "./confirm.js";
import { editPromptInEditor } from "./editor.js";
import {
  REPO_CONFIG_FILE,
  getConfig,
  getPromptValue,
  getRepoConfig,
  initRepoConfig,
  resetCustomPrompt,
  resetRepoPrompt,
  setApiKey,
  setCustomPrompt,
  setRepoPrompt,
} from "./config.js";
import { DEFAULT_SYSTEM_PROMPT } from "./prompt.js";

process.on("SIGINT", () => {
  process.exit(0);
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const git: SimpleGit = simpleGit();
const program = new Command();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .option("-p, --push", "push after committing")
  .option("-i, --issue <number>", "Link commit to GitHub issue");

program
  .command("init")
  .description(`Create ${REPO_CONFIG_FILE} for shared repository prompt rules`)
  .action(async () => {
    try {
      await ensureInsideGitRepo();
      await initRepoConfig();
      console.log(`${chalk.green(REPO_CONFIG_FILE)} created successfully!`);
    } catch (error) {
      console.error(chalk.red("Init failed:"), getErrorMessage(error));
      process.exit(1);
    }
  });

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
  .option("--repo", "Save the custom prompt in git-aic.config.json for the current repository")
  .option("--global", "Save the custom prompt in the global git-aic config")
  .option("-t, --text <prompt>", "Set the custom prompt from a string")
  .option("-f, --file <path>", "Set the custom prompt from a file")
  .action(
    async (options: {
      local?: boolean;
      repo?: boolean;
      global?: boolean;
      text?: string;
      file?: string;
    }) => {
    try {
      const cfg = await getConfig();
      const selectedScopes = [options.local, options.repo, options.global].filter(Boolean);

      if (selectedScopes.length > 1) {
        console.log(
          chalk.red("Use only one of --local, --repo, or --global at a time."),
        );
        process.exit(1);
      }

      if (options.text && options.file) {
        console.log(
          chalk.red("Use either --text or --file, not both at the same time."),
        );
        process.exit(1);
      }

      if (options.local || options.repo) {
        await ensureInsideGitRepo();
      }

      let editedPrompt = "";

      if (options.text) {
        editedPrompt = options.text.trim();
      } else if (options.file) {
        editedPrompt = (await fs.readFile(options.file, "utf-8")).trim();
      } else {
        const repoPrompt = options.local || options.repo
          ? getPromptValue(await getRepoConfig())
          : undefined;
        const globalPrompt = getPromptValue(cfg);
        const startingPrompt = options.local
          ? ((await getLocalPrompt()) ?? repoPrompt ?? globalPrompt ?? DEFAULT_SYSTEM_PROMPT)
          : (repoPrompt ?? globalPrompt ?? DEFAULT_SYSTEM_PROMPT);

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
      } else if (options.repo) {
        await setRepoPrompt(editedPrompt);
        console.log(chalk.green("Repository system prompt saved successfully!"));
      } else {
        await setCustomPrompt(editedPrompt);
        console.log(chalk.green("Global system prompt saved successfully!"));
      }
    } catch (error) {
      console.error(chalk.red("Prompt edit failed:"), getErrorMessage(error));
      process.exit(1);
    }
    },
  );

promptCommand
  .command("reset")
  .description("Reset the system prompt back to the default")
  .option("--local", "Reset the prompt in the current repository")
  .option("--repo", "Reset the prompt in git-aic.config.json for the current repository")
  .option("--global", "Reset the prompt in the global git-aic config")
  .action(async (options: { local?: boolean; repo?: boolean; global?: boolean }) => {
    try {
      const selectedScopes = [options.local, options.repo, options.global].filter(Boolean);

      if (selectedScopes.length > 1) {
        console.log(
          chalk.red("Use only one of --local, --repo, or --global at a time."),
        );
        process.exit(1);
      }

      if (options.local) {
        await ensureInsideGitRepo();
        await resetLocalPrompt();
        console.log(chalk.green("Local system prompt reset to default."));
        return;
      }

      if (options.repo) {
        await ensureInsideGitRepo();
        await resetRepoPrompt();
        console.log(chalk.green("Repository system prompt reset to default."));
        return;
      }

      await resetCustomPrompt();
      console.log(chalk.green("Global system prompt reset to default."));
    } catch (error) {
      console.error(chalk.red("Prompt reset failed:"), getErrorMessage(error));
      process.exit(1);
    }
  });

program.action(async (options) => {
  try {
    await ensureInsideGitRepo();
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

    const msg = isAbort ? "Operation cancelled" : getErrorMessage(error);
    console.error(chalk.red("\nCommit failed:"), msg);
    process.exit(isAbort ? 0 : 1);
  }
});

program.parse(process.argv);
