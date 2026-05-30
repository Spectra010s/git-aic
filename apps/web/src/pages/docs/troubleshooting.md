---
layout: ../../layouts/DocsLayout.astro
title: Troubleshooting
description: Troubleshooting
seoDescription: Troubleshoot common Git-AIC issues including repository checks, empty prompts, and generated message editing.
---

# Troubleshooting

## Not Inside a Git Repository

If you run Git-AIC outside a Git repository, it fails with:

```text
Commit failed: Not inside a Git repository.
```

Local and repository prompt commands such as `git aic prompt edit --local`, `git aic prompt edit --repo`, and `git aic init` also require a Git repository.

## Repository Config Already Exists

If `git aic init` fails because `git-aic.config.json` already exists, edit the existing file or run:

```bash
git aic prompt edit --repo
```

Git-AIC does not overwrite an existing repository config during initialization.

## Shared Repository Prompt Not Applying

Make sure `git-aic.config.json` is at the repository root and uses the `prompt` field:

```json
{
  "prompt": "Use conventional commits."
}
```

Shared repository prompts take priority over private local and global prompts.

## Empty Prompt

If you save an empty prompt during prompt editing, Git-AIC fails the command and does not save it.

## Empty Commit Message

If you clear the generated commit message during editor-based editing, Git-AIC asks you to edit it again instead of committing an empty message.

## Editing Generated Commit Messages

When the generated message is shown, you can choose:

- `y` to accept
- `r` to regenerate
- `n` to abort
- `e` to edit

Editing uses your editor and preserves multiline commit messages.
