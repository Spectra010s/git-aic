import { useState } from "react";
import { navItems } from "../constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-4 border-b border-line">
      <div className="flex items-center justify-between gap-4 md:hidden px-4">
        <a className="flex items-center gap-3 font-mono font-bold text-ink no-underline" href="#top">
          <span>Git-AIC</span>
        </a>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 text-ink"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </button>
      </div>

      <nav className="md:hidden">
        {menuOpen && (
          <ul className="list-none border-t border-line bg-surface p-0 mt-4">
            {navItems.map((item) => (
              <li key={item} className="border-b border-line last:border-b-0">
                <a
                  className="block px-4 py-4 text-ink-muted no-underline hover:text-ink"
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
            <li>
              <a
                className="block px-4 py-4 text-ink no-underline hover:opacity-80 transition-opacity"
                href="https://github.com/Spectra010s/git-aic"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        )}
      </nav>

      <div className="hidden md:flex md:items-center md:justify-between px-8">
        <a className="flex items-center gap-3 font-mono text-lg font-bold text-ink no-underline" href="#top">
          <span>Git-AIC</span>
        </a>
        <nav aria-label="Primary">
          <ul className="m-0 flex list-none items-center gap-8 p-0 text-sm font-medium text-ink-muted">
            {navItems.map((item) => (
              <li key={item}>
                <a className="block no-underline hover:text-ink transition-colors" href={`#${item.toLowerCase()}`}>
                  {item}
                </a>
              </li>
            ))}
            <li>
              <a
                className="block text-ink no-underline hover:opacity-80 transition-opacity"
                href="https://github.com/Spectra010s/git-aic"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
