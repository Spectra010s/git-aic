import { Config } from '../config/index.js';
import { generateGeminiMessage } from './gemini.js';
import { generateOpenAIMessage } from './openai.js';

export interface ProviderOptions {
  diff: string;
  systemPrompt: string;
  config: Config;
}

export async function callProvider(
  providerName: string,
  options: ProviderOptions
): Promise<string> {
  const name = providerName.toLowerCase();
  if (name === 'gemini') {
    return generateGeminiMessage(options);
  } else if (name === 'openai') {
    return generateOpenAIMessage(options);
  } else {
    throw new Error(`Unsupported provider: ${providerName}`);
  }
}
