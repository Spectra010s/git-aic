---
layout: ../../layouts/DocsLayout.astro
title: Installation
description: Installation
seoDescription: Install Git-AIC globally or locally in your project as a devDependency using npm or pnpm.
---

# Installation

Install Git-AIC globally or locally in your project using your package manager.

## 1. Global Installation

Install Git-AIC globally so it is available in any repository on your machine:

### Using npm:

```bash
npm install -g git-aic
```

### Using pnpm:

```bash
pnpm add -g git-aic
```

---

## 2. Local Installation (Per Project)

If you prefer to lock the version specifically for a project or share it with your team, install it as a development dependency:

### Using npm:

```bash
npm install --save-dev git-aic
```

### Using pnpm:

```bash
pnpm add --save-dev git-aic
```

---

## 3. Next Steps

After installation, verify that the CLI is available:

```bash
git aic --help
```

For instructions on configuring scripts and running the tool with npm or pnpm, see the [Usage Guide](/docs/usage).
