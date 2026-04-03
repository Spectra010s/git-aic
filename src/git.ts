import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";

const git: SimpleGit = simpleGit();
const LOCAL_PROMPT_KEY = "aic.prompt";

export const getGitDiff = async () => {
  try {
    await git.raw(["config", "core.autocrlf", "true"]);
    let diff = await git.diff(["--cached", "--ignore-space-at-eol"]);
    if (!diff) {
      console.log("No staged changes detected. Auto-staging all files...");
      await git.add(".");
      diff = await git.diff(["--cached", "--ignore-space-at-eol"]);
      if (!diff) return "";
    }
    return diff;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export async function getLocalPrompt(): Promise<string | undefined> {
  try {
    const prompt = await git.raw(["config", "--local", "--get", LOCAL_PROMPT_KEY]);
    const trimmed = prompt.trim();
    return trimmed || undefined;
  } catch {
    return undefined;
  }
}

export async function setLocalPrompt(prompt: string) {
  await git.raw(["config", "--local", LOCAL_PROMPT_KEY, prompt]);
}

export async function resetLocalPrompt() {
  try {
    await git.raw(["config", "--local", "--unset", LOCAL_PROMPT_KEY]);
  } catch {
    return;
  }
}
