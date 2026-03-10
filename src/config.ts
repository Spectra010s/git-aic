import fs from "fs/promises";
import path from "path";
import os from "os";
import chalk from "chalk";

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

export async function getConfig(): Promise<Record<string, any>> {
  const configPath = getConfigPath();

  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === "ENOENT") return {};
    console.error(chalk.red("Failed to read config:"), err.message);
    return {};
  }
}

export async function saveConfig(data: Record<string, any>) {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);

  await fs.mkdir(dir, { recursive: true });

  const current = await getConfig();
  const newConfig = { ...current, ...data };

  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
}

export async function setApiKey(key: string) {
  await saveConfig({ apiKey: key });
}
