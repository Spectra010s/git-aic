import { COMMANDS } from "../constants";
import { CopyButton } from "./CopyButton";

export function Hero() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24 border-b border-line">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <header className="space-y-6 md:col-span-7">
          <p className="font-mono text-sm text-ink-muted uppercase tracking-wider">
            Git CLI Extension
          </p>
          <h1 className="max-w-[12ch] md:max-w-none">
            AI-Generated Git Commits.
          </h1>
          <p className="text-ink-muted text-lg max-w-[28rem] leading-relaxed">
            Stop wasting mental energy on commit messages. Generate professional, semantic commits from your staged diffs in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              className="bg-ink text-page inline-flex items-center justify-center px-6 py-3 font-medium hover:opacity-90 transition-opacity"
              href="https://github.com/Spectra010s/git-aic"
            >
              View Repository
            </a>
            <a
              className="border border-line text-ink inline-flex items-center justify-center px-6 py-3 font-medium hover:bg-surface transition-colors"
              href="#commands"
            >
              CLI Reference
            </a>
          </div>
        </header>

        <aside className="md:col-span-5 self-center text-sm md:text-base">
          <div className="shadow-2xl">
            <div className="bg-surface border border-line border-b-0 px-4 py-3 flex gap-1.5 backdrop-blur-md">
              <div className="w-2.5 h-2.5 rounded-full border border-line bg-ink/10" />
              <div className="w-2.5 h-2.5 rounded-full border border-line bg-ink/5" />
              <div className="w-2.5 h-2.5 rounded-full border border-line bg-ink/2" />
            </div>
            <div className="bg-surface border border-line p-5 pt-2 font-mono text-xs md:text-sm">
              <p className="text-ink-muted mb-4 uppercase tracking-widest text-xs">Quick Install</p>
              <div className="flex items-center justify-between gap-4 mb-6">
                <p className="text-ink">$ {COMMANDS.install}</p>
                <CopyButton text={COMMANDS.install} className="opacity-100 md:opacity-0 md:group-hover:opacity-100" />
              </div>
              
              <div className="space-y-1">
                <p className="opacity-50">$ {COMMANDS.basic}</p>
                <p className="text-ink-muted italic">Analyzing staged changes...</p>
                <p className="text-ink font-medium text-emerald-800">Proposed: "feat(core): extract layout components"</p>
                <p className="text-ink-muted">Confirm commit? [y/n/r/e]: <span className="animate-pulse inline-block w-2 bg-ink h-4 align-middle" /></p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
