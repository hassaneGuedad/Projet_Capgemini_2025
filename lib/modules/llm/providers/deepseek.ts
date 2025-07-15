import { BaseProvider } from '../base-provider';

/**
 * Définition des informations d'un modèle de langage
 * 
 * Cette interface décrit les métadonnées d'un modèle LLM
 */
export type ModelInfo = {
  /** Nom technique unique du modèle (ex: 'deepseek-chat') */
  name: string;
  /** Nom d'affichage convivial pour l'utilisateur */
  label: string;
  /** Nom du fournisseur du modèle */
  provider: string;
  /** Nombre maximum de tokens autorisés dans une requête */
  maxTokenAllowed: number;
};

/**
 * Implémentation du fournisseur DeepSeek pour les modèles de langage
 * 
 * Cette classe étend BaseProvider et implémente les fonctionnalités spécifiques
 * à l'API DeepSeek. Elle permet de :
 * 1. Configurer l'accès à l'API DeepSeek
 * 2. Déclarer les modèles disponibles
 * 3. Créer des instances pour interagir avec les modèles
 */
export default class DeepseekProvider extends BaseProvider {
  /** Nom technique du fournisseur */
  name = 'DeepSeek';
  
  /** Lien pour obtenir une clé API */
  getApiKeyLink = 'https://platform.deepseek.com/console/api-keys';

  /**
   * Configuration spécifique au fournisseur
   * 
   * - apiTokenKey: Nom de la variable d'environnement contenant la clé API
   */
  config = {
    apiTokenKey: 'DEEPSEEK_API_KEY',
  };

  /**
   * Liste des modèles statiques fournis par DeepSeek
   * 
   * DeepSeek ne fournit pas d'API publique pour lister les modèles dynamiquement,
   * donc nous déclarons manuellement les modèles disponibles.
   */
  staticModels: ModelInfo[] = [
    {
      name: 'deepseek-chat',
      label: 'DeepSeek Chat',
      provider: 'DeepSeek',
      maxTokenAllowed: 8000,
    },
    {
      name: 'deepseek-coder',
      label: 'DeepSeek Coder',
      provider: 'DeepSeek',
      maxTokenAllowed: 8000,
    },
  ];

  /**
   * Récupère les modèles dynamiques
   * 
   * @returns {Promise<ModelInfo[]>} La liste des modèles disponibles
   * 
   * Note: DeepSeek ne fournit pas d'API pour lister les modèles dynamiquement,
   * donc nous retournons simplement les modèles statiques.
   */
  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: any,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    // DeepSeek n'a pas d'API publique pour lister les modèles
    return this.staticModels;
  }

  /**
   * Génère du texte à l'aide d'un modèle DeepSeek
   * 
   * @param {object} params - Paramètres de génération
   * @param {string} params.prompt - Prompt à envoyer au modèle
   * @param {string} [params.model] - Nom du modèle à utiliser
   * @param {string} params.apiKey - Clé API pour l'authentification
   * @param {string} [params.system] - Message système optionnel
   * @returns {Promise<string>} Le texte généré par le modèle
   */
  async generateText({
    prompt,
    model = 'deepseek-chat',
    apiKey,
    system
  }: {
    prompt: string;
    model?: string;
    apiKey: string;
    system?: string;
  }): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // DeepSeek retourne généralement data.choices[0].message.content
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Crée une instance pour interagir avec un modèle DeepSeek
   * 
   * @param {object} options - Options pour la création de l'instance
   * @param {string} options.model - Nom du modèle à utiliser
   * @param {object} [options.serverEnv] - Variables d'environnement du serveur
   * @param {object} [options.apiKeys] - Clés API pour l'authentification
   * @param {object} [options.providerSettings] - Paramètres du fournisseur
   * @returns {object} L'instance pour interagir avec le modèle
   */
  getModelInstance(options: {
    model: string;
    serverEnv?: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
  }) {
    const { apiKeys, providerSettings, serverEnv, model } = options;
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'DEEPSEEK_API_KEY',
    });
    if (!apiKey) throw new Error('DeepSeek API key is required');
    return {
      /**
       * Génère du texte à l'aide du modèle
       * 
       * @param {string} prompt - Prompt à envoyer au modèle
       * @param {string} [system] - Message système optionnel
       * @returns {Promise<string>} Le texte généré par le modèle
       */
      generate: async (prompt: string, system?: string) => {
        return this.generateText({ prompt, model, apiKey, system });
      }
    };
  }
}
