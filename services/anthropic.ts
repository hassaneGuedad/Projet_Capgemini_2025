import axios from "axios";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  throw new Error("CLAUDE_API_KEY is not configured in environment variables");
}

type ClaudeResponse = {
  content: { text: string }[];
};

export async function callClaude(prompt: string, system?: string): Promise<string> {
  try {
  const res = await axios.post(
    CLAUDE_API_URL,
    {
      model: "claude-3-sonnet-20240229",
      max_tokens: 2048,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      }
    }
  );
    
  const data = res.data as ClaudeResponse;
  return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    
    // Gestion d'erreur simplifiée
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        throw new Error("Clé API Claude invalide ou expirée");
      }
      if (axiosError.response?.status === 429) {
        throw new Error("Limite de requêtes API dépassée");
      }
      throw new Error(`Erreur API Anthropic: ${axiosError.response?.data?.error?.message || axiosError.message}`);
    }
    
    throw new Error(`Erreur lors de l'appel à l'API Claude: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}