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

## Shared Repository Config

Create a repository config file for team-wide prompt rules:

```bash
git aic init
```

This creates `git-aic.config.json` at the repository root:

```json
{
  "prompt": "Use Conventional Commits format: <type>(<scope>): <description>. Keep the subject under 72 characters. Use scopes that match the changed package, module, or feature area. Write clear imperative summaries without trailing punctuation. Include a short body with bullet points only when the change is complex. Do not include explanations outside the commit message."
}
```

Commit this file when a team should share the same commit-generation rules.

Do not store API keys or secrets in `git-aic.config.json`.

Prompt resolution order:

1. shared repository prompt from `git-aic.config.json`
2. private local prompt from Git config
3. global prompt from Git-AIC config
4. built-in default prompt

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
