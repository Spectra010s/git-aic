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

## Resolution Order

When Git-AIC builds the prompt for the model, it resolves in this order:

1. local prompt from Git config
2. global prompt from Git-AIC config
3. built-in default prompt

## Storage

Global prompt data is stored in Git-AIC's own config.

Local prompt data is stored in repository Git config under:

```ini
[aic]
	prompt = ...
```

Git-AIC writes this through `git config --local`.

## Editor Behavior

When Git-AIC opens an editor, it resolves the editor in this order:

1. `VISUAL`
2. `EDITOR`
3. `editor`
