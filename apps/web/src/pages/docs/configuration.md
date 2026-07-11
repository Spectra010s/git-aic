---
layout: ../../layouts/DocsLayout.astro
title: Configuration
description: Configuration
seoDescription: Learn how to set API keys, choose active AI providers, select models, and manage configuration scopes.
---

# Configuration

Git-AIC supports multiple AI providers (Google Gemini and OpenAI), custom model names, and hierarchical cascading configuration scopes.

## Interactive Configuration

Run the base config command to view your current active settings and launch the interactive setup wizard:

```bash
git aic config
```

---

## Configuration Scopes

When reading and writing configurations, Git-AIC supports three scopes:

- `--global` (default): Configures settings globally in `~/.config/git-aic/config.json`.
- `--local`: Configures settings locally in your current Git repository config (`.git/config`).
- `--repo`: Configures settings repository-wide in `git-aic.config.json` at the root of the repository (can be committed to Git).

---

## Setting Config Values

You can set configuration keys specifically using the `set` subcommand:

```bash
git aic config set <key> <value> [--global|--repo|--local]
```

### Supported Keys:

- `provider`: The active provider (`gemini` or `openai`).
- `model`: The active model name (e.g., `gemini-2.5-flash`, `gpt-4o-mini`).
- `gemini-key`: Your Google Gemini API Key.
- `openai-key`: Your OpenAI API Key.
- `prompt`: A custom system instruction prompt.

### Examples:

```bash
# Set OpenAI as the active provider globally
git aic config set provider openai

# Set a custom model specifically for the current repository
git aic config set model gemini-1.5-pro --local
```

---

## Reading Config Values

To read the raw, unmasked value of any configuration key (including API keys), use the `get` subcommand:

```bash
git aic config get <key> [--global|--repo|--local]
```

### Examples:

```bash
# Get the active model resolved from the cascade
git aic config get model

# Read your Gemini API key from the global scope
git aic config get gemini-key --global
```

---

## Cascading Resolution Rules

When retrieving configuration values, Git-AIC resolves them using different cascades depending on the type of key to prioritize team defaults for configurations and security for keys.

### 1. General Config Cascade (provider, model)

Repository settings override local clones, which override global user preferences:

1. **Repository Config** (`git-aic.config.json` at the repository root).
2. **Local Git Config** (`.git/config`).
3. **Global Config** (`~/.config/git-aic/config.json`).

### 2. API Credentials Cascade (gemini-key, openai-key)

Environment variables take absolute precedence, followed by global settings, local overrides, and repository-wide configs:

1. **Environment Variables** (`GEMINI_COMMIT_MESSAGE_API_KEY` or `OPENAI_API_KEY`).
2. **Global Config** (`~/.config/git-aic/config.json`).
3. **Local Git Config** (`.git/config`).
4. **Repository Config** (`git-aic.config.json` — _avoid storing keys here_).

---

## Prompt Resolution Order

When resolving the system prompt instruction for generating commits, Git-AIC follows this order:

1. **Shared repository prompt** from `git-aic.config.json` (if committed at repo root).
2. **Private local prompt** from your local Git config (`.git/config`).
3. **Global prompt** from your global Git-AIC configuration (`~/.config/git-aic/config.json`).
4. **Built-in default prompt**.

---

## Shared Repository Config

Create a shared repository config file for team-wide prompt rules:

```bash
git aic init
```

This creates a `git-aic.config.json` file at the repository root:

```json
{
  "prompt": "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message."
}
```

> **Warning:** Never commit API keys or private credentials into `git-aic.config.json`.

---

## Basic Commands

Generate a commit message:

```bash
git aic
```

Generate and append an issue-closing reference:

```bash
git aic --issue 42
```

Generate and push after commit:

```bash
git aic --push
```

Edit the shared repository prompt:

```bash
git aic prompt edit --repo
```

Reset the shared repository prompt:

```bash
git aic prompt reset --repo
```
