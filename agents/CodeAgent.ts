import { callClaude } from "@/services/anthropic";
import { FilePlan, GeneratedFile } from "@/types/agents";

export async function CodeAgent(filePlan: FilePlan): Promise<GeneratedFile> {
  const prompt = `Génère le code pour le fichier suivant :\nPath: ${filePlan.path}\nDescription: ${filePlan.description}\nDonne uniquement le code, sans explication.`;
  const code = await callClaude(prompt);
  return { path: filePlan.path, content: code };
}