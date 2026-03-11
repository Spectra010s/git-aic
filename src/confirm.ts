import readline from "node:readline/promises";
import chalk from "chalk";

export const getUserConfirmation = async (message: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.green(`\nProposed: "${message}"`));
  const answer = await rl.question(
    chalk.blue("Confirm commit? [y=yes, n=no, r=retry, e=edit]: "),
  );
  rl.close();

  const choice = (answer.toLowerCase() || "y").trim();

  if (choice === "e") {
    const editRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    console.log(chalk.cyan("\nEdit the message:"));

    editRl.write(message);

    let editedMessage = "";
    while (!editedMessage.trim()) {
      editedMessage = await editRl.question("> ");

      if (!editedMessage.trim()) {
        console.log(
          chalk.red("Commit message cannot be empty. Please type something."),
        );
      }
    }

    editRl.close();

    return { choice: "y", message: editedMessage };
  }

  return { choice, message };
};
