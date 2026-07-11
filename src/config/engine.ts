import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { simpleGit } from "simple-git";
import { Config } from "./types.js";
import { getConfigPath, getRepoConfigPath } from "./paths.js";

// Helper to determine the target scope from options
export function getScope(options: { global?: boolean; repo?: boolean; local?: boolean }): "global" | "repo" | "local" {
  if (options.local) return "local";
  if (options.repo) return "repo";
  return "global";
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

// Cascading getConfigValue
export async function getResolvedConfigValue(key: keyof Config): Promise<string | undefined> {
  const isApiKey = key === "apiKey" || key === "openaiApiKey";

  if (isApiKey) {
    // API Key Cascade: Env -> Global -> Local -> Repo
    if (key === "apiKey" && process.env.GEMINI_COMMIT_MESSAGE_API_KEY) {
      return process.env.GEMINI_COMMIT_MESSAGE_API_KEY;
    }
    if (key === "openaiApiKey" && process.env.OPENAI_API_KEY) {
      return process.env.OPENAI_API_KEY;
    }

    // 1. Check global config
    const globalCfg = await getConfig();
    if (globalCfg[key]) return globalCfg[key];

    // 2. Check local git config
    const git = simpleGit();
    try {
      const localVal = await git.getConfig(`git-aic.${key}`);
      if (localVal.value) return localVal.value;
    } catch {}

    // 3. Check repo config
    const repoCfg = await getRepoConfig();
    if (repoCfg[key]) return repoCfg[key];

    return undefined;
  } else {
    // General Config Cascade: Repo -> Local -> Global
    // 1. Check repo config
    const repoCfg = await getRepoConfig();
    if (repoCfg[key]) return repoCfg[key];

    // 2. Check local git config
    const git = simpleGit();
    try {
      const localVal = await git.getConfig(`git-aic.${key}`);
      if (localVal.value) return localVal.value;
    } catch {}

    // 3. Check global config
    const globalCfg = await getConfig();
    if (globalCfg[key]) return globalCfg[key];

    return undefined;
  }
}

// Get a configuration value from a specific scope
export async function getConfigValueAtScope(key: keyof Config, scope: "global" | "repo" | "local"): Promise<string | undefined> {
  if (scope === "repo") {
    const cfg = await getRepoConfig();
    return cfg[key];
  } else if (scope === "local") {
    const git = simpleGit();
    try {
      const localVal = await git.getConfig(`git-aic.${key}`);
      return localVal.value || undefined;
    } catch {
      return undefined;
    }
  } else {
    const cfg = await getConfig();
    return cfg[key];
  }
}

// Cascading saveConfigValue to specific scope
export async function saveConfigValue(key: keyof Config, value: string, scope: "global" | "repo" | "local") {
  if (scope === "repo") {
    await saveRepoConfig({ [key]: value });
  } else if (scope === "local") {
    const git = simpleGit();
    await git.addConfig(`git-aic.${key}`, value);
  } else {
    await saveConfig({ [key]: value });
  }
}

// Helpers for backward compatibility
export async function setApiKey(key: string) {
  await saveConfig({ apiKey: key });
}

export async function setOpenaiApiKey(key: string) {
  await saveConfig({ openaiApiKey: key });
}

export async function setProvider(provider: string) {
  await saveConfig({ provider });
}

export async function setModel(model: string) {
  await saveConfig({ model });
}
