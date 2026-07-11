import readline from 'node:readline';
import chalk from 'chalk';

export async function selectPrompt<T extends string>(
  message: string,
  choices: { name: string; value: T }[]
): Promise<T> {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    const stdin = process.stdin;
    const stdout = process.stdout;

    const isRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    // Hide cursor
    stdout.write('\u001B[?25l');

    const render = () => {
      readline.cursorTo(stdout, 0);
      readline.clearScreenDown(stdout);
      stdout.write(`${chalk.bold(message)}\n`);
      choices.forEach((choice, index) => {
        if (index === selectedIndex) {
          stdout.write(`${chalk.green('❯')} ${chalk.cyan(choice.name)}\n`);
        } else {
          stdout.write(`  ${choice.name}\n`);
        }
      });
      readline.moveCursor(stdout, 0, -(choices.length + 1));
    };

    render();

    const onData = (key: string) => {
      if (key === '\u0003') {
        // Ctrl+C
        stdout.write('\u001B[?25h');
        readline.moveCursor(stdout, 0, choices.length + 1);
        process.exit(0);
      }
      if (key === '\r' || key === '\n') {
        // Enter
        stdin.removeListener('data', onData);
        stdin.setRawMode(isRaw);
        stdin.pause();
        stdout.write('\u001B[?25h');
        readline.cursorTo(stdout, 0);
        readline.clearScreenDown(stdout);
        stdout.write(`${chalk.bold(message)} ${chalk.green(choices[selectedIndex].name)}\n`);
        resolve(choices[selectedIndex].value);
        return;
      }
      if (key === '\u001b[A') {
        // Up Arrow
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
        render();
      }
      if (key === '\u001b[B') {
        // Down Arrow
        selectedIndex = (selectedIndex + 1) % choices.length;
        render();
      }
    };

    stdin.on('data', onData);
  });
}
