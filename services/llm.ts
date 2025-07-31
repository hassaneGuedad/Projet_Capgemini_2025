import { LLMManager } from '@/lib/modules/llm/manager';

/**
 * Enrichit le prompt utilisateur avec des instructions supplémentaires
 * pour formater la réponse en fichiers de code bien structurés.
 * 
 * @param {string} userPrompt - Le prompt original de l'utilisateur
 * @returns {string} Le prompt enrichi avec des instructions de formatage
 */
export function enrichPrompt(userPrompt: string): string {
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

/**
 * Service de gestion des appels aux modèles de langage (LLM)
 * 
 * Ce service fournit une interface simplifiée pour interagir avec différents fournisseurs
 * et modèles de langage via le LLMManager. Il implémente le pattern Singleton pour assurer
 * qu'une seule instance du service est utilisée dans toute l'application.
 */
export class LLMService {
  private static instance: LLMService;
  private llmManager: LLMManager;

  /**
   * Constructeur privé pour forcer l'utilisation de getInstance()
   */
  private constructor() {
    this.llmManager = LLMManager.getInstance();
  }

  /**
   * Récupère l'instance unique du service LLM (pattern Singleton)
   * 
   * @returns {LLMService} L'instance unique du service
   */
  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  /**
   * Appelle un modèle de langage spécifique avec le prompt fourni
   * 
   * @param {string} provider - Le fournisseur du modèle (ex: 'OpenAI', 'DeepSeek')
   * @param {string} model - L'identifiant du modèle à utiliser
   * @param {string} prompt - Le prompt à envoyer au modèle
   * @param {string} [system] - Message système optionnel pour guider le modèle
   * @returns {Promise<string>} La réponse du modèle
   * @throws {Error} Si l'appel au modèle échoue
   */
  async callModel(provider: string, model: string, prompt: string, system?: string): Promise<string> {
    try {
      const enhancedPrompt = enrichPrompt(prompt);
      return await this.llmManager.callModel(provider, model, enhancedPrompt, system);
    } catch (error) {
      console.error(`Error calling ${provider}/${model}:`, error);
      throw error;
    }
  }

  /**
   * Appelle spécifiquement le modèle DeepSeek avec un prompt formaté pour la génération de code
   * 
   * @param {string} prompt - Le prompt utilisateur à envoyer à DeepSeek
   * @param {string} [system] - Message système optionnel
   * @returns {Promise<string>} La réponse du modèle DeepSeek
   * @throws {Error} Si l'appel à DeepSeek échoue
   */
  async callDeepSeek(prompt: string, system?: string): Promise<string> {
    try {
      const enhancedPrompt = enrichPrompt(prompt);
      return await this.llmManager.callModel('DeepSeek', 'deepseek-chat', enhancedPrompt, system);
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      throw error;
    }
  }

  /**
   * Récupère la liste des modèles disponibles
   * 
   * @returns {any[]} Liste des informations sur les modèles disponibles
   */
  getAvailableModels(): any[] {
    return this.llmManager.getModelList();
  }

  /**
   * Récupère la liste des fournisseurs disponibles
   * 
   * @returns {any[]} Liste des informations sur les fournisseurs disponibles
   */
  getAvailableProviders(): any[] {
    return this.llmManager.getAllProviders();
  }
}