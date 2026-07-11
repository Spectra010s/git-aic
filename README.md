<p align="center">
  <img src="https://git-aic.pages.dev/favicon.png" alt="Git-AIC Logo" width="80" height="80" />
</p>

<h1 align="center">Git-AIC</h1>

<p align="center">
  <b>An AI-powered Git commit generator for a cleaner, automated Git workflow.</b>
</p>

---

Git-AIC is a command-line interface (CLI) tool that helps you write perfect Git commit messages every time. It uses AI to analyze your staged changes and then suggests a concise, standard-compliant commit message, making your commit history clean and easy to follow. You stay in control, choosing to accept, edit, or regenerate messages on the fly.

## Overview

This project helps developers maintain a consistent and high-quality Git commit history without the manual effort. It takes your staged code changes, uses AI to understand them, and proposes a commit message that follows best practices like Conventional Commits. No more struggling to describe your changes; just quick, automated suggestions that you can fine-tune.

## Features

Git-AIC comes packed with features designed to streamline your Git workflow:

*   **AI-Powered Message Generation**
    It taps into Google Gemini or OpenAI APIs to analyze your Git diff and suggest descriptive, conventional commit messages.

    ```mermaid
    sequenceDiagram
      actor User
      participant CLI as "Git-AIC CLI"
      participant Git as "Git Repository"
      participant Config as "Config System"
      participant LLM as "LLM Provider (Gemini/OpenAI)"
      participant Editor as "User's Editor"

      User->>CLI: `git aic`
      CLI->>Git: Get staged changes (diff)
      Git-->>CLI: Diff content
      CLI->>Config: Resolve active LLM provider & prompt
      Config-->>CLI: Provider config (model, keys, prompt)
      CLI->>LLM: Send diff and system prompt
      LLM-->>CLI: Generated commit message
      CLI->>User: Display proposed message (e.g., "feat(auth): add login form")
      User->>CLI: Confirm / Edit / Retry / Reject
      alt If User Chooses 'Edit'
        CLI->>Editor: Open message for editing
        Editor-->>User: (User edits message)
        Editor-->>CLI: Edited message
        CLI->>User: (Re-confirm edited message)
      end
      alt If User Chooses 'Retry'
        CLI->>LLM: Send diff and system prompt (regenerate)
      end
      alt If User Chooses 'Confirm'
        CLI->>Git: Execute `git commit -m "..."`
        opt If `--push` flag is present
          CLI->>Git: Execute `git push`
        end
        Git-->>CLI: Commit successful
        CLI->>User: Confirmation message
      end
    ```

*   **Local & On-Demand Execution**
    It runs entirely in your terminal, only when you explicitly call it. This means no background processes, no editor lock-in, and full control over when and how it operates.

*   **Full Control Over Rules**
    You can customize the system prompt to enforce your team's specific commit conventions, formatting styles, or preferred level of detail.

    ```mermaid
    sequenceDiagram
      actor User
      participant CLI as "Git-AIC CLI"
      participant ConfigSys as "Configuration System"
      participant Editor as "User's Editor"

      User->>CLI: `git aic prompt edit --global`
      CLI->>ConfigSys: Get current global prompt
      ConfigSys-->>CLI: Existing prompt text (or default)
      CLI->>Editor: Open prompt.txt with prompt text
      Editor-->>User: (User edits the prompt)
      Editor-->>CLI: New prompt text from editor
      CLI->>ConfigSys: Save new global prompt
      ConfigSys-->>CLI: Confirmation of save
      CLI->>User: "Global system prompt saved successfully!"
    ```

*   **Flexible Prompt and Config Management**
    Configure your AI provider (Gemini or OpenAI), custom models, and API keys. Settings can be managed globally, per repository, or even locally for a specific clone, with an interactive wizard for easy setup.

    ```mermaid
    sequenceDiagram
      actor User
      participant CLI as "Git-AIC CLI"
      participant ConfigSys as "Configuration System"
      box Configuration Scopes
        participant Global as "Global Config (user home)"
        participant Repo as "Repository Config (git-aic.config.json)"
        participant Local as "Local Git Config (.git/config)"
        participant EnvVars as "Environment Variables"
      end

      User->>CLI: `git aic config`
      CLI->>ConfigSys: Read all config layers (EnvVars, Local, Repo, Global)
      ConfigSys-->>CLI: Resolved current config values
      CLI->>User: Display current active config (provider, model, keys)
      CLI->>User: "Run interactive config wizard? [y/N]"
      User->>CLI: `y`
      CLI->>User: "Select active provider:" (e.g., Gemini, OpenAI)
      User->>CLI: User selection (e.g., `gemini`)
      CLI->>User: "Select Gemini Model:" (e.g., 2.5 Flash, 1.5 Pro)
      User->>CLI: User selection (e.g., `gemini-2.5-flash`)
      CLI->>User: "Enter Gemini API Key:"
      User->>CLI: User input (or skip)
      CLI->>ConfigSys: Save new config values (provider, model, API key) to default scope (Global)
      ConfigSys-->>CLI: Confirmation of save
      CLI->>User: "Configuration saved successfully!"
    ```

*   **Conventional Commits Compliance**
    It strictly adheres to Conventional Commits guidelines (e.g., `feat:`, `fix:`, `refactor:`, `chore:`), helping you maintain a semantically versioned and readable commit history.

*   **Commit Confirmation & Editing**
    Before committing, you get a chance to review the generated message. You can accept it as is, open it in your editor for full control, retry generation if you're not satisfied, or simply reject the commit.

*   **Issue Linking**
    Easily link your commits to GitHub issues using the `--issue <number>` flag.

*   **Optional Push After Commit**
    Add `-p` or `--push` to automatically push your changes to the remote repository after a successful commit.

*   **Seamless Git Integration**
    It integrates directly with Git as a CLI tool, making it a natural extension of your existing workflow.

## System Architecture / Design

Git-AIC operates as a lightweight CLI application that orchestrates interactions between your local Git repository, user configuration, external AI services, and your preferred text editor. It's designed to be on-demand, only springing into action when you invoke it.

```mermaid
flowchart LR
    User["Developer (CLI User)"] --> GitAIC["Git-AIC CLI (Node.js)"]
    GitAIC --> GitRepo["Git Repository"]
    GitRepo -->|Staged Diff| GitAIC
    GitAIC --> ConfigSys["Configuration System"]
    ConfigSys -->|Read/Write Config| UserFS["User Filesystem (Global config, .git/config, git-aic.config.json)"]
    ConfigSys -->|API Keys (Env Vars)| OS["Operating System (Environment Variables)"]
    GitAIC -->|API Request| LLMProvider["LLM Provider (Google Gemini / OpenAI APIs)"]
    LLMProvider -->|Generated Message| GitAIC
    GitAIC --> Editor["User's Text Editor"]
    Editor -->|Edited Message/Prompt| GitAIC
    GitAIC --> GitRepo -->|Commit Changes| GitAIC
    GitAIC -->|Optional Push| RemoteGit["Remote Git Hosting (GitHub, GitLab, etc.)"]
```

## Installation

To get Git-AIC up and running on your system, follow these steps:

### User Installation

To install `git-aic` globally via npm and use it immediately:

```bash
npm i -g git-aic
```

After installation, you can check its usage:

```bash
git aic --help
```

### Developer Installation (For Contributors)

If you're looking to contribute to the project, here's how to set up the development environment:

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Spectra010s/git-aic.git
    cd git-aic
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Build the Project**

    ```bash
    npm run build
    ```

## Configuration

Git-AIC offers a flexible configuration system that supports multiple AI providers (Google Gemini and OpenAI), custom model names, and cascading configuration scopes.

### 1. Interactive Config Wizard

The easiest way to manage your configuration is through the interactive setup wizard:

```bash
git aic config
```

This command displays your current active settings and guides you through setting up providers, models, and API keys.

### 2. Manual Commands & Scopes

You can directly `set` and `get` individual configuration values with explicit scope flags:

```bash
# Set active provider globally
git aic config set provider openai --global

# Set a custom model for the current repository only
git aic config set model gemini-1.5-pro --local

# Get the raw value of a specific key
git aic config get gemini-key
```

Supported scope flags:
*   `--global`: (Default) Saves to your global Git-AIC config file (e.g., `~/.config/git-aic/config`).
*   `--repo`: Saves to `git-aic.config.json` at your current repository root. This is great for sharing config with team members.
*   `--local`: Saves to your repository's local Git config (`.git/config`).

### 3. Environment Variables (Fallback)

For sensitive API keys, environment variables take precedence over all config files. This is often preferred for CI/CD pipelines or temporary use.

*   **Gemini API Key**: `export GEMINI_COMMIT_MESSAGE_API_KEY=your_key_here`
*   **OpenAI API Key**: `export OPENAI_API_KEY=your_key_here`

## Environment Variables

Git-AIC uses the following environment variables, primarily for API keys:

*   `GEMINI_COMMIT_MESSAGE_API_KEY`: Your API key for Google Gemini.
    *   Example: `export GEMINI_COMMIT_MESSAGE_API_KEY=AIzaSy...`
*   `OPENAI_API_KEY`: Your API key for OpenAI services.
    *   Example: `export OPENAI_API_KEY=sk-...`

## Usage

Using Git-AIC is straightforward. Here are the common commands:

### Commit With AI Assistance

Run this command to have Git-AIC generate a commit message based on your staged changes:

```bash
git aic
```

*   It will display a proposed commit message.
*   You can then `y` (accept), `e` (edit in your default editor), `r` (retry generation), or `n` (reject and abort) the message.
*   Editing supports multiline commit messages and opens your configured text editor.

### Commit and Link to Issue

To automatically include an issue reference in your commit message:

```bash
git aic --issue 123
```

This will append `closes #123` (or similar, based on your prompt) to the generated message.

### Commit and Push

If you want to commit and then immediately push to your remote:

```bash
git aic -p
```

This combines the commit and push actions into a single command for convenience.

### Manage Prompts

Git-AIC gives you fine-grained control over the system prompt, which dictates how AI generates messages.

```bash
# Edit the global system prompt in your editor
git aic prompt edit --global

# Reset the local repository prompt to default
git aic prompt reset --local
```

For more detailed instructions on editing, resetting, and sharing prompts, refer to the [Prompts Guide](docs/prompts.md) (if available).



## Contributing

We welcome contributions to Git-AIC! If you're interested in making this tool even better, please consider:

1.  **Forking the Repository**: Start by forking the project to your GitHub account.
2.  **Clone Your Fork**: `git clone https://github.com/your-username/git-aic.git`
3.  **Create a New Branch**: `git checkout -b feature/your-feature-name`
4.  **Make Your Changes**: Implement your feature or bug fix.
5.  **Test Your Changes**: Ensure everything works as expected.
6.  **Commit Your Changes**: Follow the Conventional Commits guidelines (you can even use Git-AIC itself!).
7.  **Push to Your Fork**: `git push origin feature/your-feature-name`
8.  **Open a Pull Request**: Submit a pull request to the `main` branch of the original repository.

Please make sure your code adheres to the project's coding style and includes appropriate tests.

## License

This project is licensed under the [ISC License](https://github.com/Spectra010s/git-aic/blob/main/LICENSE).

## Author Info

**Spectra010s**

*   [Portfolio](https://spectra010s.biuld.app)
*   [X (Twitter)](https://x.com/Spectra010s)
*   [LinkedIn](https://www.linkedin.com/in/adeloye-adetayo-273723253)



_README was generated by [Dokugen](https://www.npmjs.com/package/dokugen)._