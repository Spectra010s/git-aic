---
layout: ../../layouts/DocsLayout.astro
title: Usage
description: Usage
seoDescription: Learn how to run Git-AIC, execute it via npm or pnpm scripts, and use interactive commit confirmation commands.
---

# Usage

Learn how to use Git-AIC to generate commit messages using global commands or local project scripts.

## Running Git-AIC

### 1. Global Commands

If installed globally, stage your files and run:

```bash
git aic
```

Options:

- **Automatic Push**: Commit and push directly to your remote:
  ```bash
  git aic --push
  ```
- **Link GitHub Issue**: Reference an issue in your commit message:
  ```bash
  git aic --issue 42
  ```

### 2. Project-Level Scripts (npm/pnpm)

If you prefer to keep the CLI scoped to a specific project and shared with your team, you can configure it locally as a development dependency.

#### Step 1: Install as a Development Dependency

Run the installation command for your package manager:

##### Using npm:

```bash
npm install --save-dev git-aic
```

##### Using pnpm:

```bash
pnpm add --save-dev git-aic
```

#### Step 2: Configure your `package.json`

Add a custom script mapping to the `scripts` object in your project's `package.json` file:

```json
{
  "scripts": {
    "commit": "git-aic"
  }
}
```

#### Step 3: Run the Commit Command

Once configured, you can run the local script:

##### Using npm:

```bash
npm run commit
```

##### Using pnpm:

```bash
pnpm commit
```

---

## Interactive Confirmation Flow

Once invoked, Git-AIC reads your staged diff and generates a proposed message:

1. **Accept (`y`)**: Accept the message and finalize the commit.
2. **Reject/Abort (`n`)**: Cancel the operation safely.
3. **Retry (`r`)**: Regenerate the message.
4. **Edit (`e`)**: Open the message in your terminal editor (e.g., Vim/Nano) to make manual edits before committing.
