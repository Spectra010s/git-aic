export function Footer() {
  return (
    <footer className="px-4 py-8 md:px-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-sm text-ink-muted border-t border-line mt-16">
      <p>
        Built by <a href="https://spectra010s.vercel.app" target="_blank" rel="noreferrer" className="text-ink hover:underline transition-all">Spectra010s</a>.
      </p>
      <nav aria-label="Footer" className="flex gap-8">
        <a className="text-ink no-underline hover:text-ink-muted transition-colors font-medium" href="https://github.com/Spectra010s/git-aic/tree/main/docs">Documentation</a>
        <a className="text-ink no-underline hover:text-ink-muted transition-colors font-medium" href="https://github.com/Spectra010s/git-aic">GitHub</a>
      </nav>
    </footer>
  );
}
