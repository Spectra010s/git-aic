export const COMMANDS = {
  install: "npm i -g git-aic",
  basic: "git aic",
  issue: "git aic --issue 42",
  prompt: {
    global: "git aic prompt edit --global",
    local: "git aic prompt edit --local",
  },
  config: "git aic config --key <key>",
  push: "git aic --push",
};

export const navItems = ["Features", "Workflow", "Commands"];

export const FEATURES = [
  {
    title: "Bring Your Own Rules",
    body: "Define prompt rules globally or per-repository. Enforce conventional commits, specific casing, or team standards locally.",
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
    body: "Your latest code changes and local or global prompts are sent to the AI.",
  },
  {
    step: "03",
    title: "Review",
    body: "Approve the generated message, retry it, or drop into Vim/Nano to finalize it.",
  },
];
