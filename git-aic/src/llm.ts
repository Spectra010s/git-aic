  import axios, { AxiosError } from "axios";
  import chalk from "chalk";
  import { buildPrompt } from "./prompt.js";
  
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
  
  interface GeminiErrorResponse {
  error: {
    message: string;
    code?: number;
    status?: string;
  }
}
  
  export const generateCommitMessage = async (
    rawDiff: string,
  ): Promise<string> => {
    const API_URL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";
    const API_KEY: string = process.env.GEMINI_COMMIT_MESSAGE_API_KEY!;
  
    if (!API_KEY) {
      console.error(
        chalk.red(
          "\nMissing GEMINI_COMMIT_MESSAGE_API_KEY environment variable.\n",
        ),
      );
  
      console.log("Please set your API key before running this command.\n");
  
      console.log(chalk.yellow("How to fix this:\n"));
  
      console.log(chalk.cyan("macOS / Linux:"));
      console.log("  export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here\n");
  
      console.log(chalk.cyan("Windows (PowerShell):"));
      console.log('  setx GEMINI_COMMIT_MESSAGE_API_KEY "your_api_key_here"\n');
  
      console.log(
        chalk.gray("After setting the variable, restart your terminal.\n"),
      );
  
      process.exit(1);
    }
    const prompt = buildPrompt(rawDiff);
  
    try {
      const response = await axios.post<GeminiResponse>(
        API_URL,
        {
          contents: [{ parts: [{ text: prompt }] }],
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
        if (axios.isAxiosError<GeminiErrorResponse>(error)) {
            if (error.response) {
          const apiMessage = error.response.data?.error?.message || error.message;
          console.error(chalk.red(`LLM request failed: ${apiMessage}`));
            } else if (error.request) {
              console.error(chalk.red("Network error: Could not connect to Google API. Check your internet."));
            } else {
              console.error(chalk.red(`An unknown error occurred during the LLM request: ${error.message}`));
            }
        } else {
           console.error(chalk.red("Unexpected Error:"), error);
        }
    return "chore: update code"; 
    }
};

 



