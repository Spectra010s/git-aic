# Git-AIC

**git-aic** is an AI-powered command-line interface (CLI) tool that upgrades your Git workflow by automatically generating high-quality, conventional commit messages.

It analyzes your staged code changes and produces concise, descriptive, and standard-compliant commit messages, helping you maintain a clean and consistent Git history.

You define the rules.  
You customize the system prompt.  
You decide when it runs.

Your workflow. Your control.

## Features

- **AI-Powered Message Generation**  
  Uses Google Gemini or OpenAI API to generate commit messages from your Git diff.

- **Self-Hosted & On-Demand**  
  Runs locally in your terminal. No background processes. No editor lock-in.

- **Full Control Over Rules**  
  Modify the system prompt to enforce your own commit conventions and formatting style.

- **Flexible Prompt Management**  
  Edit prompts globally, privately per repository, or through committed repository config.

- **Conventional Commits Compliance**  
  Strictly follows formats like `feat:`, `fix:`, `refactor:`, `chore:`.

- **Commit Confirmation & Editing**  
  Before committing, you can:
  - Accept the suggested commit message
  - Edit the full message in your editor
  - Reject it
  - Retry generation

- **Issue Linking**  
  Attach commits to GitHub issues with `--issue <number>`.

- **Optional Push After Commit**  
  Use `-p` or `--push` to push after committing.

- **Config Management**  
  Set active provider, custom models, and API keys via the interactive setup wizard.

- **TypeScript & Type Safety**  
  Built with TypeScript for maintainability and reliability.

- **Seamless Git Integration**  
  Directly integrates with Git using a CLI.

## Why Not Just Use Copilot?

Many AI commit tools:

- Depend on editor integrations
- Limit customization
- Enforce their defaults
- Restrict usage
- Run continuously in the background

This tool is different.

It runs only when you call it.  
It follows your prompt rules.  
It generates commits exactly how you define them.  
It stays out of your way.

There are no forced conventions.  
No hidden behavior.  
No unnecessary background processes.

If needed, you can rotate API keys later. You stay in control.

This is controlled automation — not passive AI assistance.

## User Installation

To install `git-aic` globally via npm:

```bash
npm i -g git-aic
```

```bash
git aic --help
```

## Developer Installation (For Contributors)

### 1. Clone the Repository

```bash
git clone https://github.com/Spectra010s/git-aic.git
cd git-aic
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

## Configuration

Git-AIC supports multiple AI providers (Google Gemini and OpenAI), custom model names, and cascading configuration scopes.

### 1. Interactive Config Wizard

To view your current active configuration and run the interactive setup wizard, simply execute:

```bash
git aic config
```

### 2. Manual Commands & Scopes

You can get and set individual configuration values directly using the `set` and `get` subcommands:

```bash
# Set active provider
git aic config set provider openai

# Set a custom model specifically for the current repository
git aic config set model gemini-1.5-pro --local

# Get the raw value of a key
git aic config get gemini-key
```

Supported scope flags are: `--global` (default), `--local` (repository `.git/config`), or `--repo` (`git-aic.config.json` at repository root).

### 3. Environment Variables (Fallback)

If you prefer environment variables, they take absolute precedence over config files for API keys:

- **Gemini API Key**: `export GEMINI_COMMIT_MESSAGE_API_KEY=your_key`
- **OpenAI API Key**: `export OPENAI_API_KEY=your_key`

## Usage

### Commit With AI Assistance

```bash
git aic
```

- Prompts you with a generated commit message.
- You can **accept, edit, reject, or retry** the message.
- Editing opens your editor and supports multiline commit messages.

### Commit and Link to Issue

```bash
git aic --issue 123
```

- Attaches the commit to GitHub issue #123.

### Commit and Push

```bash
git aic -p
```

- Pushes automatically after committing.

### Manage Prompts

Git-AIC allows you to customize the system prompt rules globally, repository-wide, or locally per-clone.

For detailed usage instructions on editing, resetting, and sharing prompts, see the [Prompts Guide](docs/prompts.md).

## How It Works

1. Captures your staged Git diff
2. Builds a strict system prompt
3. Resolves the active prompt from local, repo, global, or default settings
4. Sends the prompt and diff to the active AI provider (Gemini or OpenAI)
5. Prompts for commit confirmation (accept, edit, retry, reject)
6. Opens your editor when you choose to edit the generated message
7. Executes `git commit` automatically
8. Optionally pushes if `-p` flag is used

---

## Technologies Used

| Technology           | Purpose                |
| -------------------- | ---------------------- |
| TypeScript           | Core language          |
| Node.js              | Runtime                |
| Axios                | HTTP client            |
| Chalk                | Styled terminal output |
| Commander.js         | CLI framework          |
| Simple-Git           | Git integration        |
| Gemini & OpenAI APIs | LLM text generation    |

## Final Takeaway

Automating repetitive tasks like **commit messages** saves time — but the real win here is ownership.

git-aic:

- **Self-hosted** — runs entirely on your machine
- **On-demand** — only runs when you call it
- **Fully customizable** — prompts, commit format, workflow
- **Under your control** — you decide every step

It runs when you need it, follows your rules, and generates commits the way **you** want.

_Choose your model. Define your prompt. Control the format. Extend or optimize anytime._

Instead of adapting to someone else's defaults, _you built a system tailored to your workflow._

You are not just using AI tools.  
You are **building them to fit your process.**

## License

[**ISC License**](https://github.com/Spectra010s/git-aic/blob/main/LICENSE)

## Author

Spectra010s

- [Portfolio](https://spectra010s.biuld.app)
- [Twitter](https://x.com/Spectra010s)
- [LinkedIn](https://www.linkedin.com/in/adeloye-adetayo-273723253)

## Parent Repository

This project is a fork and standalone version of:

[https://github.com/samueltuoyo15/Commit-Message-Tool](https://github.com/samueltuoyo15/Commit-Message-Tool)
