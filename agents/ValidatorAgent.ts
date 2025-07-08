import { GeneratedFile } from "@/types/agents";

export async function ValidatorAgent(file: GeneratedFile): Promise<boolean> {
  // Ici, je peux utiliser un linter, ou je demande à Claude de vérifier la syntaxe
  return file.content.length > 0;
}