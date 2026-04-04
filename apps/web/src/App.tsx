import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Workflow } from "./components/Workflow";
import { Commands } from "./components/Commands";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-page text-ink font-sans antialiased">
      <div className="max-w-7xl mx-auto border-x border-line flex flex-col min-h-screen">
        <Header />
      <main id="top" className="flex flex-col">
        <Hero />
        <Features />
        <Workflow />
        <Commands />
        
        <section className="px-4 py-16 md:px-8 grid gap-8 md:grid-cols-[1fr_0.8fr]">
          <article className="space-y-4">
            <p className="font-mono text-sm text-ink-muted uppercase tracking-wider mb-2">Direction</p>
            <h2 className="text-3xl">Native Workflow.</h2>
            <p className="text-ink-muted leading-relaxed max-w-[50ch]">
              Your brain is for building code, not for summarizing it. Git-AIC automates the friction of the commit stage, proposing perfectly formatted messages so you can stay in your flow.
            </p>
          </article>
          <ul className="m-0 list-none p-6 space-y-4 bg-surface border border-line">
            {[
              "Global and local prompt configuration",
              "Editor-based prompt and commit-message editing",
              "GitHub issue linking during generation"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-ink-muted">
                <span className="text-ink">›</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      </div>
    </div>
  );
}
