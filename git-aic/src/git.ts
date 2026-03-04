import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";

const git: SimpleGit = simpleGit();

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
