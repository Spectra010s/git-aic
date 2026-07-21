#!/usr/bin/env node

import fs from 'fs/promises';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { simpleGit } from 'simple-git';
import type { SimpleGit } from 'simple-git';
import chalk from 'chalk';
import {
  ensureInsideGitRepo,
  getGitDiff,
  getLocalPrompt,
  resetLocalPrompt,
  setLocalPrompt,
} from './git.js';
import { generateCommitMessage } from './llm.js';
import { getUserConfirmation } from './confirm.js';
import { editPromptInEditor } from './editor.js';
import readline from 'node:readline';
import readlinePromises from 'node:readline/promises';
import {
  REPO_CONFIG_FILE,
  getConfig,
  getPromptValue,
  getRepoConfig,
  initRepoConfig,
  resetCustomPrompt,
  resetRepoPrompt,
  setCustomPrompt,
  setRepoPrompt,
  getScope,
  saveConfigValue,
  getResolvedConfigValue,
  getConfigValueAtScope,
  setApiKey,
  setOpenaiApiKey,
  setProvider,
  setModel,
} from './config/index.js';
import { DEFAULT_SYSTEM_PROMPT } from './prompt.js';
import { selectPrompt } from './select.js';

process.on('SIGINT', () => {
  process.exit(0);
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const git: SimpleGit = simpleGit();
const program = new Command();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .option('-p, --push', 'push after committing')
  .option('-i, --issue <number>', 'Link commit to GitHub issue');

program
  .command('init')
  .description(`Create ${REPO_CONFIG_FILE} for shared repository prompt rules`)
  .action(async () => {
    try {
      await ensureInsideGitRepo();
      await initRepoConfig();
      console.log(`${chalk.green(REPO_CONFIG_FILE)} created successfully!`);
    } catch (error) {
      console.error(chalk.red('Init failed:'), getErrorMessage(error));
      process.exit(1);
    }
  });

const configCmd = program
  .command('config')
  .description('Configure settings interactively or manage config values')
  .option('-k, --key <key>', 'Set API Key for the active provider')
  .option('--gemini-key <key>', 'Set your Gemini API Key')
  .option('--openai-key <key>', 'Set your OpenAI API Key')
  .option('-p, --provider <provider>', 'Set the active AI provider (gemini or openai)')
  .option('-m, --model <model>', 'Set the active model name')
  .option('--global', 'Use global config (default)')
  .option('--repo', 'Use git-aic.config.json inside the repository')
  .option('--local', 'Use local repository git config')
  .action(async function (options: {
    key?: string;
    geminiKey?: string;
    openaiKey?: string;
    provider?: string;
    model?: string;
    global?: boolean;
    repo?: boolean;
    local?: boolean;
  }) {
    let changed = false;
    const scope = getScope(options);

    if (options.key) {
      const cfg = await getConfig();
      const currentProvider = cfg.provider || 'gemini';
      if (currentProvider === 'openai') {
        await saveConfigValue('openaiApiKey', options.key, scope);
        console.log(chalk.green(`OpenAI API Key saved successfully!`));
      } else {
        await saveConfigValue('apiKey', options.key, scope);
        console.log(chalk.green(`Gemini API Key saved successfully!`));
      }
      changed = true;
    }

    if (options.geminiKey) {
      await saveConfigValue('apiKey', options.geminiKey, scope);
      console.log(chalk.green(`Gemini API Key saved successfully!`));
      changed = true;
    }

    if (options.openaiKey) {
      await saveConfigValue('openaiApiKey', options.openaiKey, scope);
      console.log(chalk.green(`OpenAI API Key saved successfully!`));
      changed = true;
    }

    if (options.provider) {
      const provider = options.provider.toLowerCase();
      if (provider !== 'gemini' && provider !== 'openai') {
        console.log(chalk.red('Invalid provider. Supported providers are: gemini, openai'));
        process.exit(1);
      }
      await saveConfigValue('provider', provider, scope);
      console.log(chalk.green(`Provider set to ${provider} successfully!`));
      changed = true;
    }

    if (options.model) {
      await saveConfigValue('model', options.model, scope);
      console.log(chalk.green(`Model set to ${options.model} successfully!`));
      changed = true;
    }

    if (changed) return;

    // Resolve active settings using cascade
    const activeProvider = (await getResolvedConfigValue('provider')) || 'gemini';
    const activeModel =
      (await getResolvedConfigValue('model')) ||
      (activeProvider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');

    console.log(chalk.cyan.bold('\nGit-AIC Configuration'));
    console.log(chalk.dim('───────────────────────────────────'));
    console.log(`${chalk.cyan('Active Provider:')} ${activeProvider}`);
    console.log(`${chalk.cyan('Active Model:')}    ${activeModel}`);

    const maskKey = (key?: string) => {
      if (!key) return chalk.yellow('Not set');
      return chalk.green(
        key.slice(0, 4) + chalk.dim('*'.repeat(Math.max(0, key.length - 8))) + key.slice(-4)
      );
    };

    const geminiKey = await getResolvedConfigValue('apiKey');
    const openaiKey = await getResolvedConfigValue('openaiApiKey');

    console.log(`${chalk.cyan('Gemini API Key:')}  ${maskKey(geminiKey)}`);
    console.log(`${chalk.cyan('OpenAI API Key:')}  ${maskKey(openaiKey)}`);
    console.log('');

    const askQuestion = async (query: string): Promise<string> => {
      const rlInstance = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const answer = await rlInstance.question(query);
      rlInstance.close();
      process.stdin.resume(); // Ensure stdin is resumed for subsequent inputs
      return answer.trim();
    };

    // Start Interactive Wizard (default to No, press Enter to close/decline)
    let startWizard = false;
    const runWizard = await askQuestion(
      chalk.blue('Would you like to run the interactive config wizard? [y/N]: ')
    );
    if (runWizard.toLowerCase() === 'y') {
      startWizard = true;
    }

    if (startWizard) {
      // 1. Select provider
      const provider = await selectPrompt('Select active provider:', [
        { name: 'Google Gemini', value: 'gemini' },
        { name: 'OpenAI', value: 'openai' },
      ]);

      // 2. Select model based on provider
      let model = '';
      if (provider === 'gemini') {
        model = await selectPrompt('Select Gemini Model:', [
          { name: 'Gemini 3.5 Flash (Recommended)', value: 'gemini-3.5-flash' },
          { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
          { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
          { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
          { name: 'Custom model name...', value: 'custom' },
        ]);
      } else {
        model = await selectPrompt('Select OpenAI Model:', [
          { name: 'GPT-4o Mini (Recommended)', value: 'gpt-4o-mini' },
          { name: 'GPT-4o', value: 'gpt-4o' },
          { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          { name: 'Custom model name...', value: 'custom' },
        ]);
      }

      if (model === 'custom') {
        model = await askQuestion('Enter custom model name: ');
      }

      // 3. Ask for API Key
      const keyPrompt =
        provider === 'gemini'
          ? 'Enter Gemini API Key (press Enter to skip): '
          : 'Enter OpenAI API Key (press Enter to skip): ';
      const key = await askQuestion(keyPrompt);

      // Save all config
      await saveConfigValue('provider', provider, scope);
      if (model) await saveConfigValue('model', model, scope);
      if (key) {
        if (provider === 'gemini') {
          await saveConfigValue('apiKey', key, scope);
        } else {
          await saveConfigValue('openaiApiKey', key, scope);
        }
      }

      console.log(chalk.green('\nConfiguration saved successfully!'));
    }
    process.exit(0);
  });

configCmd
  .command('set <key> <value>')
  .description('Set a configuration option (e.g. provider, model, gemini-key, openai-key, prompt)')
  .option('--global', 'Use global config (default)')
  .option('--repo', 'Use git-aic.config.json inside the repository')
  .option('--local', 'Use local repository git config')
  .action(async function (key, value, options) {
    const parentOpts = this.parent ? this.parent.opts() : {};
    const mergedOpts = { ...parentOpts, ...options };
    const scope = getScope(mergedOpts);

    const k = key.toLowerCase();
    if (k === 'provider') {
      const provider = value.toLowerCase();
      if (provider !== 'gemini' && provider !== 'openai') {
        console.error(chalk.red('Invalid provider. Supported providers are: gemini, openai'));
        process.exit(1);
      }
      await saveConfigValue('provider', provider, scope);
      console.log(chalk.green(`Provider set to ${provider} successfully!`));
    } else if (k === 'model') {
      await saveConfigValue('model', value, scope);
      console.log(chalk.green(`Model set to ${value} successfully!`));
    } else if (k === 'gemini-key') {
      await saveConfigValue('apiKey', value, scope);
      console.log(chalk.green(`Gemini API Key saved successfully!`));
    } else if (k === 'openai-key') {
      await saveConfigValue('openaiApiKey', value, scope);
      console.log(chalk.green(`OpenAI API Key saved successfully!`));
    } else if (k === 'prompt') {
      await saveConfigValue('prompt', value, scope);
      console.log(chalk.green(`Custom system prompt saved successfully!`));
    } else {
      console.error(
        chalk.red(
          `Invalid configuration key: ${key}. Valid keys: provider, model, gemini-key, openai-key, prompt`
        )
      );
      process.exit(1);
    }
  });

configCmd
  .command('get <key>')
  .description('Get a configuration option')
  .option('--global', 'Use global config (default)')
  .option('--repo', 'Use git-aic.config.json inside the repository')
  .option('--local', 'Use local repository git config')
  .action(async function (key, options) {
    const parentOpts = this.parent ? this.parent.opts() : {};
    const mergedOpts = { ...parentOpts, ...options };
    const scope = getScope(mergedOpts);

    const k = key.toLowerCase();
    let val: string | undefined;

    if (k === 'provider') {
      val =
        mergedOpts.global || mergedOpts.repo || mergedOpts.local
          ? await getConfigValueAtScope('provider', scope)
          : await getResolvedConfigValue('provider');
    } else if (k === 'model') {
      val =
        mergedOpts.global || mergedOpts.repo || mergedOpts.local
          ? await getConfigValueAtScope('model', scope)
          : await getResolvedConfigValue('model');
    } else if (k === 'gemini-key') {
      val =
        mergedOpts.global || mergedOpts.repo || mergedOpts.local
          ? await getConfigValueAtScope('apiKey', scope)
          : await getResolvedConfigValue('apiKey');
    } else if (k === 'openai-key') {
      val =
        mergedOpts.global || mergedOpts.repo || mergedOpts.local
          ? await getConfigValueAtScope('openaiApiKey', scope)
          : await getResolvedConfigValue('openaiApiKey');
    } else if (k === 'prompt') {
      val =
        mergedOpts.global || mergedOpts.repo || mergedOpts.local
          ? await getConfigValueAtScope('prompt', scope)
          : await getResolvedConfigValue('prompt');
    } else {
      console.error(
        chalk.red(
          `Invalid configuration key: ${key}. Valid keys: provider, model, gemini-key, openai-key, prompt`
        )
      );
      process.exit(1);
    }

    if (val === undefined) {
      console.log(chalk.yellow('Not set'));
    } else {
      console.log(val);
    }
  });

const promptCommand = program
  .command('prompt')
  .description('Manage the system prompt used for commit generation');

promptCommand
  .command('edit')
  .description('Edit and save a custom system prompt in your editor')
  .option('--local', 'Save the custom prompt in the current repository')
  .option('--repo', 'Save the custom prompt in git-aic.config.json for the current repository')
  .option('--global', 'Save the custom prompt in the global git-aic config')
  .option('-t, --text <prompt>', 'Set the custom prompt from a string')
  .option('-f, --file <path>', 'Set the custom prompt from a file')
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
          console.log(chalk.red('Use only one of --local, --repo, or --global at a time.'));
          process.exit(1);
        }

        if (options.text && options.file) {
          console.log(chalk.red('Use either --text or --file, not both at the same time.'));
          process.exit(1);
        }

        if (options.local || options.repo) {
          await ensureInsideGitRepo();
        }

        let editedPrompt = '';

        if (options.text) {
          editedPrompt = options.text.trim();
        } else if (options.file) {
          editedPrompt = (await fs.readFile(options.file, 'utf-8')).trim();
        } else {
          const repoPrompt =
            options.local || options.repo ? getPromptValue(await getRepoConfig()) : undefined;
          const globalPrompt = getPromptValue(cfg);
          const startingPrompt = options.local
            ? ((await getLocalPrompt()) ?? repoPrompt ?? globalPrompt ?? DEFAULT_SYSTEM_PROMPT)
            : (repoPrompt ?? globalPrompt ?? DEFAULT_SYSTEM_PROMPT);

          editedPrompt = await editPromptInEditor(startingPrompt);
        }

        if (!editedPrompt) {
          console.log(chalk.red('Prompt was empty. Nothing saved.'));
          process.exit(1);
        }

        if (options.local) {
          await setLocalPrompt(editedPrompt);
          console.log(chalk.green('Local system prompt saved successfully!'));
        } else if (options.repo) {
          await setRepoPrompt(editedPrompt);
          console.log(chalk.green('Repository system prompt saved successfully!'));
        } else {
          await setCustomPrompt(editedPrompt);
          console.log(chalk.green('Global system prompt saved successfully!'));
        }
      } catch (error) {
        console.error(chalk.red('Prompt edit failed:'), getErrorMessage(error));
        process.exit(1);
      }
    }
  );

promptCommand
  .command('reset')
  .description('Reset the system prompt back to the default')
  .option('--local', 'Reset the prompt in the current repository')
  .option('--repo', 'Reset the prompt in git-aic.config.json for the current repository')
  .option('--global', 'Reset the prompt in the global git-aic config')
  .action(async (options: { local?: boolean; repo?: boolean; global?: boolean }) => {
    try {
      const selectedScopes = [options.local, options.repo, options.global].filter(Boolean);

      if (selectedScopes.length > 1) {
        console.log(chalk.red('Use only one of --local, --repo, or --global at a time.'));
        process.exit(1);
      }

      if (options.local) {
        await ensureInsideGitRepo();
        await resetLocalPrompt();
        console.log(chalk.green('Local system prompt reset to default.'));
        return;
      }

      if (options.repo) {
        await ensureInsideGitRepo();
        await resetRepoPrompt();
        console.log(chalk.green('Repository system prompt reset to default.'));
        return;
      }

      await resetCustomPrompt();
      console.log(chalk.green('Global system prompt reset to default.'));
    } catch (error) {
      console.error(chalk.red('Prompt reset failed:'), getErrorMessage(error));
      process.exit(1);
    }
  });

program.action(async (options) => {
  try {
    await ensureInsideGitRepo();
    const diff = await getGitDiff();
    if (!diff) {
      console.log(chalk.yellow('No changes to commit!'));
      process.exit(0);
    }

    const status = await git.status();
    console.log(chalk.blue('\nFiles being committed:'));
    status.staged.forEach((file) => console.log(chalk.cyan(`- ${file}`)));
    console.log('');

    let currentMsg = '';
    let confirmed = false;
    let finalMsg = '';

    const issueSuffix = options.issue ? `, closes #${options.issue}` : '';

    console.log(chalk.blue('Analyzing staged changes...\n'));

    while (!confirmed) {
      let currentMsg = await generateCommitMessage(diff);

      currentMsg = `${currentMsg}${issueSuffix}`;

      const { choice, message } = await getUserConfirmation(currentMsg);

      if (choice === 'y') {
        finalMsg = message;
        confirmed = true;
      } else if (choice === 'r') {
        console.log(chalk.yellow('Regenerating...\n'));
        continue;
      } else {
        console.log(chalk.red('Aborted.'));
        process.exit(0);
      }
    }

    console.log(chalk.blue(`> ran: git commit -m "${finalMsg}"`));
    await git.commit(finalMsg);
    console.log(chalk.green('\nCommit successful'));

    if (options.push) {
      console.log(chalk.blue('> ran: git push'));
      await git.push();
      console.log(chalk.green('Push successful'));
    }
  } catch (error: unknown) {
    let isAbort = false;

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const e = error as { code?: string };
      isAbort = e.code === 'ABORT_ERR';
    }

    const msg = isAbort ? 'Operation cancelled' : getErrorMessage(error);
    console.error(chalk.red('\nCommit failed:'), msg);
    process.exit(isAbort ? 0 : 1);
  }
});

program.parse(process.argv);
