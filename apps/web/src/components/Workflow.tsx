import { WORKFLOW } from "../constants";

export function Workflow() {
  return (
    <section id="workflow" className="px-4 py-16 md:px-8 bg-surface border-b border-line">
      <header className="mb-12">
        <p className="font-mono text-sm text-ink-muted uppercase tracking-wider mb-2">Workflow</p>
        <h2 className="text-3xl">Built for the moment after staging.</h2>
      </header>
      <ol className="m-0 grid list-none gap-8 p-0 md:grid-cols-3">
        {WORKFLOW.map((item) => (
          <li key={item.step} className="space-y-3">
            <span className="font-mono text-xs text-ink bg-[rgba(255,255,255,0.1)] px-2 py-1">
              Step {item.step}
            </span>
            <h3 className="text-lg">{item.title}</h3>
            <p className="text-ink-muted text-sm leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
