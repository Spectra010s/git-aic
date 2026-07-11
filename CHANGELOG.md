# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-07-11

### Added
- Multi-provider support for **OpenAI** alongside Google Gemini.
- Interactive configuration setup wizard via `git aic config` to guide users through credentials, active provider, and model setup.
- Configuration subcommands `set` and `get` with `--global`, `--local`, and `--repo` scope flags.
- Dual-cascading config engine distinguishing general settings (Repository -> Local -> Global) from API credentials (Env Variables -> Global -> Local -> Repository).
- Core development guidelines, Prettier formatting (`npm run format`), and local commit testing (`npm run commit`) documented in the new `CONTRIBUTING.md`.
- Dedicated `Usage` guide covering CLI flags and local project script configurations (`npm`/`pnpm`).
- Expanded `Installation` guide covering global and local project-level installations.

### Changed
- Overhauled the landing page, documentation site, and CLI metadata to be provider-agnostic.

### Removed
- Deprecated `--show` and `--key` flags from the base `config` command.
- Redundant configuration key aliases (`apikey`, `openaiapikey`) from CLI subcommands.

---

## [1.3.0] - 2026-06-15

### Added
- Shared repository prompt configuration via `git-aic.config.json` at the root of the repository.
- Repository-level prompt commands: `git aic init`, `git aic prompt edit --repo`, and `git aic prompt reset --repo`.
- Static documentation site for installation, configuration, prompts, and troubleshooting.
- Page-specific JSON-LD schemas and sitemap generation for SEO.

### Changed
- Updated documentation site layout and redirected domain configurations to `git-aic.pages.dev`.

---

## [1.2.1] - 2026-05-20

### Fixed
- Handling of empty commit messages during editor-based message editing.

---

## [1.2.0] - 2026-05-18

### Added
- Support for editor-based commit message editing during verification (options: `y` to accept, `n` to abort, `r` to retry, `e` to edit).
- Option to push automatically after committing using `--push` or `-p`.
- Custom issue linking support via `--issue <number>` flag.

---

## [1.1.0] - 2026-05-02

### Added
- Support for text and file inputs when modifying prompts.
- Private local prompt override files in local Git config.

---

## [1.0.0] - 2026-04-20

### Added
- Initial release of `git-aic` CLI tool.
- Commit message generation using Google Gemini API.
- Support for global prompt custom system instructions.
