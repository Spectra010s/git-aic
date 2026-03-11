# Git Aic

**git-aic** is a command-line interface (CLI) tool built in TypeScript that upgrades your Git workflow by automatically generating high-quality, conventional commit messages.

Powered by Google Gemini, it analyzes your staged code changes and produces concise, descriptive, and standard-compliant commit messages, helping you maintain a clean and consistent Git history.

You define the rules.  
You customize the system prompt.  
You decide when it runs.

Your workflow. Your control.

## Features

- **AI-Powered Message Generation**  
  Uses Google Gemini API to generate commit messages from your Git diff.

- **Self-Hosted & On-Demand**  
  Runs locally in your terminal. No background processes. No editor lock-in.

- **Full Control Over Rules**  
  Modify the system prompt to enforce your own commit conventions and formatting style.

- **Conventional Commits Compliance**  
  Strictly follows formats like `feat:`, `fix:`, `refactor:`, `chore:`.

- **Commit Confirmation & Editing**  
  Before committing, you can:
  - Accept the suggested commit message
  - Edit the message
  - Reject it
  - Retry generation

- **Issue Linking**  
  Attach commits to GitHub issues with `--issue <number>`.

- **Optional Push After Commit**  
  Use `-p` or `--push` to push after committing.

- **Config Management**  
  Set your Gemini API key or view your config:
  - `git aic config --key <key>`
  - `git aic config`

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

### Set API Key (Primary)

Use the CLI config command to save your Google Gemini API key:

```bash
git aic config --key <your_api_key>
```

To view your current config:

```bash
git aic config
```

> "\*Note:\*\* it's masked by default for security reasons

To view the whole current config api key

```bash
git aic config --show
```

### Environment Variable (Fallback)

If you prefer not to use the config system, you can set it manually in your environment:

- **macOS / Linux:**

```bash
export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here
```

- **Windows (PowerShell):**

```powershell
setx GEMINI_COMMIT_MESSAGE_API_KEY "your_api_key_here"
```

After setting the variable, restart your terminal.

> **Note:** This method works, but using the CLI config is safer and easier for long-term usage.

## Usage

### Commit With AI Assistance

```bash
git aic
```

- Prompts you with a generated commit message.
- You can **accept, edit, reject, or retry** the message.

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

### Configure API Key

```bash
git aic config --key <key>
```

- Saves your Google Gemini API key.

```bash
git aic config
```

- Displays your saved config.

That’s it.

No need to manually write commit messages anymore.

## How It Works

1. Captures your staged Git diff
2. Builds a strict system prompt
3. Sends the diff to Gemini
4. Enforces Conventional Commit formatting
5. Prompts for commit confirmation (accept, edit, retry, reject)
6. Executes `git commit` automatically
7. Optionally pushes if `-p` flag is used

You can modify commit behavior by editing:

```
src/prompt.ts
```

---

## Technologies Used

| Technology        | Purpose                |
| ----------------- | ---------------------- |
| TypeScript        | Core language          |
| Node.js           | Runtime                |
| Axios             | HTTP client            |
| Chalk             | Styled terminal output |
| Commander.js      | CLI framework          |
| Simple-Git        | Git integration        |
| Google Gemini API | LLM text generation    |

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

[**ISC License**](https://github.com/Spectra010s/git-aic/main/#license)

## Author

Spectra010s

- [Twitter](https://x.com/Spectra010s)
- [LinkedIn](https://www.linkedin.com/in/adeloye-adetayo-273723253)

## Parent Repository

This project is a fork and standalone version of:

[https://github.com/samueltuoyo15/Commit-Message-Tool](https://github.com/samueltuoyo15/Commit-Message-Tool)

---

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green?style=flat&logo=nodedotjs&logoColor=white)
