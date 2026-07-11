import axios from 'axios';
import chalk from 'chalk';
import { ProviderOptions } from './index.js';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateOpenAIMessage({
  systemPrompt,
  config,
}: ProviderOptions): Promise<string> {
  const model = config.model || 'gpt-4o-mini';
  const API_KEY = config.openaiApiKey || process.env.OPENAI_API_KEY;

  if (!API_KEY) {
    console.error(chalk.red('\nMissing OpenAI API key.\n'));
    console.log('Please set your API key before running this command.\n');
    console.log(chalk.yellow('How to fix this:\n'));
    console.log(
      chalk.gray(
        'Recommended: use the config helper to save it permanently:\n  git-aic config --openai-key <your_api_key>\n'
      )
    );
    console.log(chalk.cyan('macOS / Linux (temporary):'));
    console.log('  export OPENAI_API_KEY=your_api_key_here\n');
    console.log(chalk.cyan('Windows (PowerShell, temporary):'));
    console.log('  setx OPENAI_API_KEY "your_api_key_here"\n');
    console.log(chalk.gray('After setting the key, restart your terminal.\n'));
    process.exit(1);
  }

  const API_URL = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post<OpenAIResponse>(
      API_URL,
      {
        model,
        messages: [{ role: 'user', content: systemPrompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices?.[0]?.message?.content?.trim() || 'chore: update code';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const apiMessage = error.response.data?.error?.message || error.message;
        console.error(chalk.red(`OpenAI request failed: ${apiMessage}`));
      } else if (error.request) {
        console.error(
          chalk.red(
            'Network error: Could not connect to OpenAI API. Check your internet connection.'
          )
        );
      } else {
        console.error(
          chalk.red(`An unknown error occurred during the OpenAI request: ${error.message}`)
        );
      }
    } else {
      console.error(chalk.red('Unexpected Error:'), error);
    }
    return 'chore: update code';
  }
}
