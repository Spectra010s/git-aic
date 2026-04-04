# Troubleshooting

## Not Inside a Git Repository

If you run Git-AIC outside a Git repository, it fails with:

```text
Commit failed: Not inside a Git repository.
```

Local prompt commands such as `git aic prompt edit --local` also require a Git repository.

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
