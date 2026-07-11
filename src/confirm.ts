import readline from 'node:readline/promises';
import chalk from 'chalk';
import { editTextInEditor } from './editor.js';

export const getUserConfirmation = async (message: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.green(`\nProposed: "${message}"`));
  const answer = await rl.question(chalk.blue('Confirm commit? [y=yes, n=no, r=retry, e=edit]: '));
  rl.close();

  const choice = (answer.toLowerCase() || 'y').trim();

  if (choice === 'e') {
    let editedMessage = message;
    while (true) {
      editedMessage = await editTextInEditor(editedMessage, 'git-aic-commit-', 'COMMIT_EDITMSG');

      if (editedMessage.trim()) {
        return { choice: 'y', message: editedMessage };
      }

      if (!editedMessage.trim()) {
        console.log(chalk.red('Commit message cannot be empty. Please edit it again.'));
      }
    }
  }

  return { choice, message };
};
