export const COMMANDS = {
  install: "npm i -g git-aic",
  basic: "git aic",
  issue: "git aic --issue 42",
  prompt: {
    global: "git aic prompt edit --global",
    local: "git aic prompt edit --local",
    repo: "git aic prompt edit --repo",
  },
  config: "git aic config",
  push: "git aic --push",
};

export const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Commands", href: "#commands" },
  { label: "Documentation", href: "/docs" },
];

export const docsNavItems = [
  { label: "Overview", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  { label: "Configuration", href: "/docs/configuration" },
  { label: "Prompts", href: "/docs/prompts" },
  { label: "Troubleshooting", href: "/docs/troubleshooting" },
];

export const FEATURES = [
  {
    title: "Bring Your Own Rules",
    body: "Define prompt rules globally, privately per-repository, or in a shared repository config. Enforce conventional commits, specific casing, or team standards locally.",
  },
  {
    title: "Multi-Provider Support",
    body: "Supports multiple AI providers out of the box. Easily switch active providers and models in seconds using the CLI setup wizard.",
  },
  {
    title: "Terminal Native",
    body: "Runs inside your terminal context without external dashboards. Integrates natively with your git staging and workflow.",
  },
  {
    title: "Editor Integration",
    body: "Review, reject, or edit messages in your preferred `$EDITOR` before anything is actually committed to the git tree.",
  },
];

export const WORKFLOW = [
  {
    step: "01",
    title: "Stage",
    body: "Git-AIC reads directly from your Git staging area. Just add your files normally.",
  },
  {
    step: "02",
    title: "Generate",
    body: "Your latest code changes and resolved prompt rules are sent to the AI.",
  },
  {
    step: "03",
    title: "Review",
    body: "Approve the generated message, retry it, or drop into Vim/Nano to finalize it.",
  },
];
