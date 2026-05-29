import fs from "fs/promises";
import path from "path";
import os from "os";
import chalk from "chalk";
import { getLocalPrompt, getRepoRoot } from "./git.js";

export interface Config {
  apiKey?: string;
  prompt?: string;
  customPrompt?: string;
}

export const REPO_CONFIG_FILE = "git-aic.config.json";
export const DEFAULT_REPO_PROMPT =
  "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message.";

function getConfigPath() {
  const toolName = "git-aic";

  if (process.platform === "win32") {
    const appData = process.env.APPDATA;
    if (!appData) throw new Error("APPDATA not defined");
    return path.join(appData, toolName, "config.json");
  } else {
    const configDir = path.join(os.homedir(), ".config", toolName);
    return path.join(configDir, "config.json");
  }
}

export async function getConfig(): Promise<Config> {
  const configPath = getConfigPath();

  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content) as Config;
  } catch (err: any) {
    if (err.code === "ENOENT") return {};
    console.error(chalk.red("Failed to read config:"), err.message);
    return {};
  }
}

export async function getRepoConfigPath(): Promise<string> {
  return path.join(await getRepoRoot(), REPO_CONFIG_FILE);
}

export function getPromptValue(config: Config): string | undefined {
  return config.prompt ?? config.customPrompt;
}

export async function getRepoConfig(): Promise<Config> {
  const configPath = await getRepoConfigPath();

  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content) as Config;
  } catch (err: any) {
    if (err.code === "ENOENT") return {};
    console.error(chalk.red("Failed to read repo config:"), err.message);
    return {};
  }
}

export async function saveConfig(data: Partial<Config>) {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);

  await fs.mkdir(dir, { recursive: true });

  const current = await getConfig();
  const newConfig: Config = { ...current, ...data };

  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
}

export async function saveRepoConfig(data: Partial<Config>) {
  const configPath = await getRepoConfigPath();
  const current = await getRepoConfig();
  const newConfig: Config = { ...current, ...data };

  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
}

export async function setApiKey(key: string) {
  await saveConfig({ apiKey: key });
}

export async function setCustomPrompt(prompt: string) {
  await saveConfig({ prompt });
}

export async function setRepoPrompt(prompt: string) {
  await saveRepoConfig({ prompt });
}

export async function resetCustomPrompt() {
  const { prompt, customPrompt, ...rest } = await getConfig();
  void prompt;
  void customPrompt;
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(rest, null, 2), "utf-8");
}

export async function resetRepoPrompt() {
  const { prompt, customPrompt, ...rest } = await getRepoConfig();
  void prompt;
  void customPrompt;
  const configPath = await getRepoConfigPath();

  const hasRemainingConfig = Object.keys(rest).length > 0;
  if (hasRemainingConfig) {
    await fs.writeFile(configPath, JSON.stringify(rest, null, 2), "utf-8");
    return;
  }

  try {
    await fs.unlink(configPath);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }
}

export async function initRepoConfig() {
  const configPath = await getRepoConfigPath();

  try {
    await fs.access(configPath);
    throw new Error(`${REPO_CONFIG_FILE} already exists.`);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  await fs.writeFile(
    configPath,
    JSON.stringify({ prompt: DEFAULT_REPO_PROMPT }, null, 2),
    "utf-8",
  );
}

export async function getResolvedPrompt(): Promise<string | undefined> {
  const repoPrompt = getPromptValue(await getRepoConfig());
  if (repoPrompt) {
    return repoPrompt;
  }

  const localPrompt = await getLocalPrompt();
  if (localPrompt) {
    return localPrompt;
  }

  const config = await getConfig();
  return getPromptValue(config);
}
