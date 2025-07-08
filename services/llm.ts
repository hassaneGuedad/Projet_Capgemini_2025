import { LLMManager } from '@/lib/modules/llm/manager';

function enrichPrompt(userPrompt: string): string {
  return `
Ignore toute explication, README ou texte hors code.

À partir de cette demande utilisateur :
"${userPrompt}"

Génère le code complet sous forme de plusieurs fichiers si nécessaire.
Pour chaque fichier, commence par une ligne :
=== NomDuFichier.extension ===
(code ici)
Ne mets rien d'autre que les fichiers et leur code, sans explication, sans README, sans balises Markdown.`;
}

export class LLMService {
  private static instance: LLMService;
  private llmManager: LLMManager;

  private constructor() {
    this.llmManager = LLMManager.getInstance();
  }

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async callModel(provider: string, model: string, prompt: string, system?: string): Promise<string> {
    try {
      return await this.llmManager.callModel(provider, model, prompt, system);
    } catch (error) {
      console.error(`Error calling ${provider}/${model}:`, error);
      throw error;
    }
  }

  async callDeepSeek(prompt: string, system?: string): Promise<string> {
    try {
      const enhancedPrompt = enrichPrompt(prompt);
      return await this.llmManager.callModel('DeepSeek', 'deepseek-chat', enhancedPrompt, system);
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      throw error;
    }
  }

  getAvailableModels() {
    return this.llmManager.getModelList();
  }

  getAvailableProviders() {
    return this.llmManager.getAllProviders();
  }
} 