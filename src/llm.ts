  import axios from "axios";
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
      console.error("LLM request failed:", error);
      return "chore: update code";
    }
  };
