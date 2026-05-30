---
layout: ../../layouts/DocsLayout.astro
title: Installation
description: Installation
seoDescription: Install Git-AIC globally with npm and confirm the CLI is available in your terminal.
---

# Installation

Install Git-AIC globally with npm:

```bash
npm i -g git-aic
```

Confirm the CLI is available:

```bash
git aic --help
```

Git-AIC is a terminal tool that generates commit messages from your staged diff using Google Gemini.

Typical flow:

1. stage your changes
2. run `git aic`
3. review the generated message
4. accept, retry, reject, or edit
5. let Git-AIC commit for you
