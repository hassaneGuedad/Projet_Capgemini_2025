import { FilePlan, GeneratedFile } from "@/types/agents";
import { LLMService } from "@/services/llm";

export async function CodeAgent(filePlan: FilePlan): Promise<GeneratedFile> {
  const prompt = `Génère le code pour le fichier suivant :\nPath: ${filePlan.path}\nDescription: ${filePlan.description}\nDonne uniquement le code, sans explication.`;
  const code = await LLMService.getInstance().callDeepSeek(prompt);
  return { path: filePlan.path, content: code };
}