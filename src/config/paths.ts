import path from "path";
import os from "os";
import { getRepoRoot } from "../git.js";

export const REPO_CONFIG_FILE = "git-aic.config.json";

export function getConfigPath() {
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

export async function getRepoConfigPath(): Promise<string> {
  return path.join(await getRepoRoot(), REPO_CONFIG_FILE);
}
