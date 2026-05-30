---
layout: ../../layouts/DocsLayout.astro
title: Prompts
description: Prompts
seoDescription: Learn how Git-AIC resolves global prompts, private local prompts, and shared repository prompts.
---

# Prompts

Git-AIC supports editable system prompts.

## Global Prompt

Edit the global prompt in your editor:

```bash
git aic prompt edit
```

Set it directly from text:

```bash
git aic prompt edit --text "Write concise conventional commits with a short body when needed."
```

Load it from a file:

```bash
git aic prompt edit --file ./prompt.txt
```

Reset it to the built-in default:

```bash
git aic prompt reset
```

## Local Prompt

Local prompts override the global prompt for the current repository only.
They are private to your clone because Git-AIC stores them in local Git config.

Edit the local prompt:

```bash
git aic prompt edit --local
```

Set it from text:

```bash
git aic prompt edit --local --text "Use a short subject and a clear explanatory body."
```

Load it from a file:

```bash
git aic prompt edit --local --file ./commit-prompt.txt
```

Reset the local prompt:

```bash
git aic prompt reset --local
```

## Shared Repository Prompt

Shared repository prompts are saved in `git-aic.config.json`.
Commit this file when a team wants the same prompt rules across the repository.
Shared repository prompts take priority over private local and global prompts.

Create a shared repository config:

```bash
git aic init
```

Edit the shared repository prompt:

```bash
git aic prompt edit --repo
```

Set it from text:

```bash
git aic prompt edit --repo --text "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message."
```

Load it from a file:

```bash
git aic prompt edit --repo --file ./commit-prompt.txt
```

Reset the shared repository prompt:

```bash
git aic prompt reset --repo
```

## Resolution Order

When Git-AIC builds the prompt for the model, it resolves in this order:

1. shared repository prompt from `git-aic.config.json`
2. private local prompt from Git config
3. global prompt from Git-AIC config
4. built-in default prompt

## Storage

Global prompt data is stored in Git-AIC's own config.

Local prompt data is stored in repository Git config under:

```ini
[aic]
	prompt = ...
```

Git-AIC writes this through `git config --local`.

Shared repository prompt data is stored in:

```text
git-aic.config.json
```

The file uses the `prompt` field:

```json
{
  "prompt": "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message."
}
```

## Editor Behavior

When Git-AIC opens an editor, it resolves the editor in this order:

1. `VISUAL`
2. `EDITOR`
3. `editor`
