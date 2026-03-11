# Automated AI Commit Assistant

The AI Commit Assistant is a command-line interface (CLI) tool built in TypeScript that upgrades your Git workflow by automatically generating high-quality, conventional commit messages.

Powered by a Large Language Model (LLM), it analyzes your staged code changes and produces concise, descriptive, and standard-compliant commit messages, helping you maintain a clean and consistent Git history.

Unlike editor-integrated AI tools, this solution is fully self-hosted and runs only when you execute it. It is not always running in the background. It operates entirely on your terms.

You define the rules.  
You customize the system prompt.  
You decide when it runs.

Your workflow. Your control.

---

## Features

- **AI-Powered Message Generation**  
  Uses Google Gemini API to generate commit messages from your Git diff.

- **Self-Hosted & On-Demand**  
  Runs locally in your terminal. No background processes. No editor lock-in.

- **Full Control Over Rules**  
  Modify the system prompt to enforce your own commit conventions and formatting style.

- **Conventional Commits Compliance**  
  Strictly follows formats like `feat:`, `fix:`, `refactor:`, `chore:`.

- **Automatic Staging**  
  If no files are staged, it automatically stages all changes before generating a message.

- **TypeScript & Type Safety**  
  Built with TypeScript for maintainability and reliability.

- **Seamless Git Integration**  
  Designed to integrate directly with Git using a global alias.

---

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

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/samueltuoyo15/Commit-Message-Tool.git
cd Commit-Message-Tool
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Variables

This tool requires a Google Gemini API key.

Environment variable:

```
GEMINI_COMMIT_MESSAGE_API_KEY
```

### macOS / Linux

```bash
export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here
```

### Windows (PowerShell)

```powershell
setx GEMINI_COMMIT_MESSAGE_API_KEY "your_api_key_here"
```

After setting the variable, restart your terminal.

This project intentionally avoids `.env` files to reduce the risk of accidentally committing sensitive credentials.

---

## Global Git Alias Setup (Recommended)

To run this tool from any Git repository, configure a global Git alias.

Replace the path below with your actual project path:

```bash
git config --global alias.aic '!npx ts-node "C:/path-to-your-project/bin/cli.ts"'
```

Now, from any Git repository, simply run:

```bash
git aic
```

That’s it.

No need to manually write commit messages anymore.

---

## How It Works

1. Captures your staged Git diff
2. Builds a strict system prompt
3. Sends the diff to Gemini
4. Enforces Conventional Commit formatting
5. Executes `git commit` automatically

You can modify commit behavior by editing:

```
src/prompt.ts
```

That file is your control layer.

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

---

## Final Takeaway

Automating repetitive tasks like commit messages saves time — but the real win here is ownership.

This tool is:

- Self-hosted
- On-demand
- Fully customizable
- Under your control

It runs when you need it.  
It follows your rules.  
It generates commits the way you want them written.

You choose the model.  
You define the prompt.  
You control the format.  
You can extend or optimize it anytime.

Instead of adapting to someone else's defaults, you built a system tailored to your workflow.

You are not just using AI tools.  
You are building them to fit your system.

---

## License

ISC License

---

## Author

Samuel Tuoyo

- [Twitter](https://x.com/TuoyoS26091)
- [LinkedIn](https://www.linkedin.com/in/samuel-tuoyo-8568b62b6)

---

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green?style=flat&logo=nodedotjs&logoColor=white)
