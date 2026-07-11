import { FEATURES } from '../constants';

export function Features() {
  return (
    <section id="features" className="px-4 py-16 md:px-8 border-b border-line">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item) => (
          <article key={item.title} className="p-6 bg-surface border border-line">
            <h2 className="text-xl mb-3">{item.title}</h2>
            <p className="text-ink-muted text-sm leading-relaxed">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
