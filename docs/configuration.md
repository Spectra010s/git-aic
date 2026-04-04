# Configuration

## API Key

Git-AIC needs a Gemini API key.

Save it with:

```bash
git aic config --key <your_api_key>
```

Show the saved key in masked form:

```bash
git aic config
```

Show the full saved key:

```bash
git aic config --show
```

You can also use an environment variable:

```bash
export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here
```

The saved config is used first. The environment variable works as fallback.

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
