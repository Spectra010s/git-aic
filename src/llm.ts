import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MAX_DIFF_CHARS = 8000;

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

const trimDiff = (diff: string): string => {
  return diff.length <= MAX_DIFF_CHARS ? diff : diff.slice(0, MAX_DIFF_CHARS);
};

const buildPrompt = (diff: string): string => {
  return `
Generate a professional Git commit message.

Rules:
- One line only
- Imperative mood (e.g. "feat", "fix", "refactor")
- Max 72 characters
- No emojis
- No punctuation at the end

Changes:
${diff}
`.trim();
};

export const generateCommitMessage = async (
  rawDiff: string,
): Promise<string> => {
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent";
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) throw new Error("Gemini API key missing");

  const diff = trimDiff(rawDiff);
  const prompt = buildPrompt(diff);

  try {
    const response = await axios.post<GeminiResponse>(
      API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 64, temperature: 0.2 },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
      },
    );

    const message =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return message && message.length > 0 ? message : "chore: update changes";
  } catch (error) {
    console.error("LLM request failed:", error);
    return "chore: update changes";
  }
};
