import { buildPrompt } from './prompt.js';
import { getConfig, getResolvedPrompt } from './config/index.js';
import { callProvider } from './providers/index.js';

export const generateCommitMessage = async (rawDiff: string): Promise<string> => {
  const config = await getConfig();
  const provider = config.provider || 'gemini';
  const systemPrompt = buildPrompt(rawDiff, await getResolvedPrompt());

  return callProvider(provider, {
    diff: rawDiff,
    systemPrompt,
    config,
  });
};
