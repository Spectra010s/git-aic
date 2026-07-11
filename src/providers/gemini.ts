import axios from "axios";
import chalk from "chalk";
import { ProviderOptions } from "./index.js";

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export async function generateGeminiMessage({
  systemPrompt,
  config,
}: ProviderOptions): Promise<string> {
  const model = config.model || "gemini-1.5-flash";
  const API_KEY = config.apiKey || process.env.GEMINI_COMMIT_MESSAGE_API_KEY;

  if (!API_KEY) {
    console.error(
      chalk.red(
        "\nMissing Gemini API key.\n",
      ),
    );
    console.log("Please set your API key before running this command.\n");
    console.log(chalk.yellow("How to fix this:\n"));
    console.log(
      chalk.gray(
        "Recommended: use the config helper to save it permanently:\n  git-aic config --gemini-key <your_api_key>\n",
      ),
    );
    console.log(chalk.cyan("macOS / Linux (temporary):"));
    console.log("  export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here\n");
    console.log(chalk.cyan("Windows (PowerShell, temporary):"));
    console.log('  setx GEMINI_COMMIT_MESSAGE_API_KEY "your_api_key_here"\n');
    console.log(chalk.gray("After setting the key, restart your terminal.\n"));
    process.exit(1);
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;

  try {
    const response = await axios.post<GeminiResponse>(
      API_URL,
      {
        contents: [{ parts: [{ text: systemPrompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
      },
    );

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "chore: update code"
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const apiMessage = error.response.data?.error?.message || error.message;
        console.error(chalk.red(`Gemini request failed: ${apiMessage}`));
      } else if (error.request) {
        console.error(
          chalk.red(
            "Network error: Could not connect to Gemini API. Check your internet connection.",
          ),
        );
      } else {
        console.error(
          chalk.red(
            `An unknown error occurred during the Gemini request: ${error.message}`,
          ),
        );
      }
    } else {
      console.error(chalk.red("Unexpected Error:"), error);
    }
    return "chore: update code";
  }
}
