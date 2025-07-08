import { BaseProvider } from '../base-provider';

export type ModelInfo = {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
};

export default class DeepseekProvider extends BaseProvider {
  name = 'DeepSeek';
  getApiKeyLink = 'https://platform.deepseek.com/console/api-keys';

  config = {
    apiTokenKey: 'DEEPSEEK_API_KEY',
  };

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

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: any,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    // DeepSeek n'a pas d'API publique pour lister les modèles, donc on retourne les statiques
    return this.staticModels;
  }

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
      generate: async (prompt: string, system?: string) => {
        return this.generateText({ prompt, model, apiKey, system });
      }
    };
  }
}
