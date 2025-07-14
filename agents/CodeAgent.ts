// Importation des types nécessaires depuis le module agents
// FilePlan: Définit la structure d'un plan de fichier 
// (chemin + description)
// GeneratedFile: Définit la structure du fichier généré (chemin + contenu)
import { FilePlan, GeneratedFile } from "@/types/agents";

// Importation du service LLM (Language Model) pour interagir avec DeepSeek
import { LLMService } from "@/services/llm";

/**
 * CodeAgent - Agent responsable de la génération de code source
 * 
 * @param filePlan - Objet contenant les informations nécessaires pour générer le fichier
 *   - path: string - Le chemin du fichier à générer (ex: 'src/components/Button.tsx')
 *   - description: string - La description détaillée du contenu attendu du fichier
 * 
 * @returns Promise<GeneratedFile> - Une promesse qui se résout avec un objet contenant:
 *   - path: string - Le chemin d'origine du fichier
 *   - content: string - Le code source généré par le modèle de langage
 */
export async function CodeAgent(filePlan: FilePlan): Promise<GeneratedFile> {
  // Construction du prompt qui sera envoyé au modèle de langage
  // Le format du prompt est conçu pour être clair et concis:
  // 1. Instruction de génération de code
  // 2. Chemin du fichier pour le contexte
  // 3. Description détaillée du contenu attendu
  // 4. Instruction pour ne renvoyer que le code sans explication
  const prompt = `Génère le code pour le fichier suivant :\nPath: ${filePlan.path}\nDescription: ${filePlan.description}\nDonne uniquement le code, sans explication.`;
  
  // Appel asynchrone au service LLM (DeepSeek) avec le prompt construit
  // - getInstance(): Utilise le pattern Singleton pour obtenir l'instance unique du service
  // - callDeepSeek(): Méthode qui envoie la requête à l'API DeepSeek avec le prompt
  const code = await LLMService.getInstance().callDeepSeek(prompt);
  
  // Retourne un objet conforme à l'interface GeneratedFile
  // - path: Reprend le chemin d'origine du fichier
  // - content: Contient le code généré par le modèle de langage
  return { 
    path: filePlan.path, 
    content: code 
  };
}