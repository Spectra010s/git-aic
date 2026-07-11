import fs from "fs/promises";
import path from "path";
import { getLocalPrompt } from "../git.js";
import { Config } from "./types.js";
import { getConfigPath, getRepoConfigPath, REPO_CONFIG_FILE } from "./paths.js";
import { getConfig, getRepoConfig, saveConfig, saveRepoConfig } from "./engine.js";

export const DEFAULT_REPO_PROMPT =
  "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message.";

export function getPromptValue(config: Config): string | undefined {
  return config.prompt ?? config.customPrompt;
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
