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
* **Automatic Push**: Commit and push directly to your remote:
  ```bash
  git aic --push
  ```
* **Link GitHub Issue**: Reference an issue in your commit message:
  ```bash
  git aic --issue 42
  ```

### 2. Project Scripts (npm/pnpm)
If installed locally as a devDependency, you can execute Git-AIC through package scripts:

#### Using npm:
Run the script defined in your `package.json`:
```bash
npm run commit
```

#### Using pnpm:
Run the script defined in your `package.json`:
```bash
pnpm run commit
```
Or directly execute the local binary:
```bash
pnpm git-aic
```

---

## Interactive Confirmation Flow

Once invoked, Git-AIC reads your staged diff and generates a proposed message:
1. **Accept (`y`)**: Accept the message and finalize the commit.
2. **Reject/Abort (`n`)**: Cancel the operation safely.
3. **Retry (`r`)**: Regenerate the message.
4. **Edit (`e`)**: Open the message in your terminal editor (e.g., Vim/Nano) to make manual edits before committing.
