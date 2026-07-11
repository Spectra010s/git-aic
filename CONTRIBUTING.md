# Contributing to Git-AIC

Thanks for your interest in contributing! This guide covers the basics to get you started.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm

## Setup

```bash
git clone https://github.com/Spectra010s/git-aic.git
cd git-aic
npm install
npm run build
```

## Development Workflow

1. Create a branch from `main`:

```bash
git checkout -b feat/your-feature
```

2. Make your changes inside `src/`.

3. Build and verify:

```bash
npm run build
```

4. Format your code:

```bash
npm run format
```

5. Stage your changes, then generate a commit message with git-aic:

```bash
git add .
npm run commit
```

## Project Structure

```
git-aic/
├── src/               # TypeScript source
│   ├── cli.ts         # CLI entry point and command registration
│   ├── config/        # Configuration engine (cascading scopes)
│   ├── providers/     # AI provider integrations (Gemini, OpenAI)
│   ├── prompt.ts      # Default system prompt
│   ├── confirm.ts     # Commit confirmation flow
│   └── editor.ts      # Editor-based editing
├── docs/              # Documentation
├── apps/web/          # Astro landing page and docs site
├── dist/              # Compiled output (do not edit)
└── package.json
```

## Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run build`    | Compile TypeScript to `dist/`            |
| `npm run format`   | Format all files with Prettier           |
| `npm run commit`   | Generate an AI commit message via git-aic |

## Code Style

- Prettier handles formatting automatically. Run `npm run format` before committing.
- Use double quotes, semicolons, and 2-space indentation.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

## Pull Requests

- Keep PRs focused on a single change.
- Reference any related issues (e.g., `Closes #42`).
- Ensure the project builds cleanly before opening.

## License

By contributing, you agree that your contributions will be licensed under the [ISC License](LICENSE).
