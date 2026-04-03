import { spawnSync } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

function splitCommand(command: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let escaping = false;

  for (const char of command.trim()) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === "\\") {
      escaping = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        parts.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (escaping || quote) {
    throw new Error("Editor command has invalid quoting.");
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

export function openInEditor(filePath: string) {
  const editor = process.env.VISUAL || process.env.EDITOR || "editor";
  const [editorCommand, ...editorArgs] = splitCommand(editor);

  if (!editorCommand) {
    throw new Error(
      "No editor found. Set VISUAL or EDITOR, or install an `editor` command.",
    );
  }

  const result = spawnSync(editorCommand, [...editorArgs, filePath], {
    stdio: "inherit",
  });

  if (result.error) {
    if ("code" in result.error && result.error.code === "ENOENT") {
      throw new Error(
        "No editor found. Set VISUAL or EDITOR, or install an `editor` command.",
      );
    }

    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Editor exited with status ${result.status}`);
  }
}

export async function editTextInEditor(
  initialText: string,
  prefix = "git-aic-",
  fileName = "message.txt",
): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  const tempFile = path.join(tempDir, fileName);

  try {
    await fs.writeFile(tempFile, `${initialText}\n`, "utf-8");
    openInEditor(tempFile);
    return (await fs.readFile(tempFile, "utf-8")).trim();
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export async function editPromptInEditor(initialPrompt: string): Promise<string> {
  return editTextInEditor(initialPrompt, "git-aic-prompt-", "prompt.txt");
}
