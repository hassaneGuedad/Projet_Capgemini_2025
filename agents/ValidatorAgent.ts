import { GeneratedFile } from "@/types/agents";

export async function ValidatorAgent(file: GeneratedFile): Promise<boolean> {
  // Ici, tu pourrais utiliser un linter, ou demander à Claude de vérifier la syntaxe
  return file.content.length > 0;
}