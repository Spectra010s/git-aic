import { COMMANDS } from '../constants';
import { CopyButton } from './CopyButton';

export function Commands() {
  return (
    <section id="commands" className="px-4 py-16 md:px-8 border-b border-line">
      <header className="mb-12">
        <p className="font-mono text-sm text-ink-muted uppercase tracking-wider mb-2">
          CLI Reference
        </p>
        <h2 className="text-3xl">Standard Commands.</h2>
      </header>
      <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
        {[
          ['Basic commit', COMMANDS.basic, 'Generate a message from your staged changes.'],
          ['API Setup', COMMANDS.config, 'Quickly set or update your AI provider keys.'],
          ['Commit & Push', COMMANDS.push, 'Streamline your workflow with auto-pushing.'],
          ['Link an issue', COMMANDS.issue, 'Append closing references in-flow.'],
          [
            'Global Prompt',
            COMMANDS.prompt.global,
            'Override system prompts globally for all repos.',
          ],
          [
            'Shared Repo Prompt',
            COMMANDS.prompt.repo,
            'Commit team prompt rules with the repository.',
          ],
        ].map(([title, command, body]) => (
          <li key={title} className="p-6 border border-line bg-surface">
            <h3 className="text-lg mb-4">{title}</h3>
            <div className="relative group/code">
              <code className="block bg-page p-3 font-mono text-xs text-ink break-all border border-line pr-12">
                $ {command}
              </code>
              <CopyButton
                text={command}
                className="absolute top-1 right-1 opacity-100 md:opacity-0 md:group-hover/code:opacity-100 transition-opacity"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
