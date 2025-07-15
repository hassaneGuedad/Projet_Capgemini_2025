import { BaseProvider } from './base-provider';
import type { ModelInfo } from './types';
import AnthropicProvider from './anthropic-provider';
import DeepseekProvider from './providers/deepseek';

/**
 * Gestionnaire central des modèles de langage (LLM)
 * 
 * Cette classe implémente le pattern Singleton pour garantir qu'une seule instance
 * du gestionnaire existe dans l'application. Elle est responsable de :
 * 1. L'enregistrement des fournisseurs de modèles (Anthropic, DeepSeek, etc.)
 * 2. La gestion de la liste des modèles disponibles
 * 3. La création d'instances de modèles pour l'exécution
 * 4. L'appel des modèles avec des prompts spécifiques
 */
export class LLMManager {
  // Instance Singleton du gestionnaire
  private static _instance: LLMManager;
  
  // Map des fournisseurs enregistrés (nom du fournisseur -> instance)
  private _providers: Map<string, BaseProvider> = new Map();
  
  // Liste consolidée de tous les modèles disponibles
  private _modelList: ModelInfo[] = [];

  /**
   * Constructeur privé pour forcer l'utilisation de getInstance()
   * Initialise le gestionnaire et enregistre les fournisseurs par défaut
   */
  private constructor() {
    this._registerProviders();
  }

  /**
   * Récupère l'instance unique du gestionnaire (pattern Singleton)
   * 
   * @returns {LLMManager} L'instance unique du gestionnaire
   */
  static getInstance(): LLMManager {
    if (!LLMManager._instance) {
      LLMManager._instance = new LLMManager();
    }
    return LLMManager._instance;
  }

  /**
   * Enregistre les fournisseurs de modèles par défaut
   * 
   * Cette méthode privée est appelée lors de l'initialisation pour
   * ajouter les fournisseurs intégrés au gestionnaire
   */
  private _registerProviders() {
    // Enregistrer le provider Anthropic (Claude)
    const anthropicProvider = new AnthropicProvider();
    this.registerProvider(anthropicProvider);

    // Enregistrer le provider DeepSeek
    const deepseekProvider = new DeepseekProvider();
    this.registerProvider(deepseekProvider);
    
    
  }

  /**
   * Enregistre un nouveau fournisseur de modèles
   * 
   * @param {BaseProvider} provider - Le fournisseur à enregistrer
   */
  registerProvider(provider: BaseProvider) {
    // Vérifier si le fournisseur est déjà enregistré
    if (this._providers.has(provider.name)) {
      console.warn(`Provider ${provider.name} is already registered. Skipping.`);
      return;
    }

    console.log('Registering Provider: ', provider.name);
    
    // Ajouter le fournisseur à la map
    this._providers.set(provider.name, provider);
    
    // Ajouter les modèles statiques du fournisseur à la liste globale
    this._modelList = [...this._modelList, ...provider.staticModels];
  }

  /**
   * Récupère un fournisseur par son nom
   * 
   * @param {string} name - Le nom du fournisseur
   * @returns {BaseProvider | undefined} Le fournisseur ou undefined si non trouvé
   */
  getProvider(name: string): BaseProvider | undefined {
    return this._providers.get(name);
  }

  /**
   * Récupère tous les fournisseurs enregistrés
   * 
   * @returns {BaseProvider[]} Liste de tous les fournisseurs
   */
  getAllProviders(): BaseProvider[] {
    return Array.from(this._providers.values());
  }

  /**
   * Récupère la liste de tous les modèles disponibles
   * 
   * @returns {ModelInfo[]} Liste des informations sur les modèles
   */
  getModelList(): ModelInfo[] {
    return this._modelList;
  }

  /**
   * Crée une instance d'un modèle spécifique
   * 
   * @param {string} providerName - Nom du fournisseur
   * @param {string} modelName - Nom du modèle
   * @returns {Promise<any>} L'instance du modèle configurée
   * @throws {Error} Si le fournisseur n'est pas trouvé ou si la clé API est manquante
   */
  async getModelInstance(providerName: string, modelName: string) {
    // Récupérer le fournisseur
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = process.env[provider.config.apiTokenKey];
    if (!apiKey) {
      throw new Error(`API key not found for provider ${providerName}`);
    }

    // Créer et retourner l'instance du modèle
    return provider.getModelInstance({
      model: modelName,
      serverEnv: process.env,
      apiKeys: { [providerName]: apiKey },
    });
  }

  /**
   * Appelle un modèle spécifique avec un prompt
   * 
   * @param {string} providerName - Nom du fournisseur
   * @param {string} modelName - Nom du modèle
   * @param {string} prompt - Prompt à envoyer au modèle
   * @param {string} [system] - Message système optionnel
   * @returns {Promise<string>} La réponse générée par le modèle
   */
  async callModel(providerName: string, modelName: string, prompt: string, system?: string) {
    // Créer une instance du modèle
    const modelInstance = await this.getModelInstance(providerName, modelName);
    
    // Exécuter le modèle avec le prompt
    return await modelInstance.generate(prompt, system);
  }
}
