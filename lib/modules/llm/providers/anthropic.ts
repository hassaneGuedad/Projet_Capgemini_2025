import { BaseProvider } from '../base-provider';

// Définition d'un type ModelInfo minimal si besoin
export type ModelInfo = {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
};

export default class AnthropicProvider extends BaseProvider {
  name = 'Anthropic';
  getApiKeyLink = 'https://console.anthropic.com/settings/keys';

  config = {
    apiTokenKey: 'ANTHROPIC_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'claude-3-7-sonnet-20250219',
      label: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      maxTokenAllowed: 128000,
    },
    {
      name: 'claude-3-5-sonnet-latest',
      label: 'Claude 3.5 Sonnet (new)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-5-sonnet-20240620',
      label: 'Claude 3.5 Sonnet (old)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-5-haiku-latest',
      label: 'Claude 3.5 Haiku (new)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    { name: 'claude-3-opus-latest', label: 'Claude 3 Opus', provider: 'Anthropic', maxTokenAllowed: 8000 },
    { name: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'Anthropic', maxTokenAllowed: 8000 },
    { name: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', provider: 'Anthropic', maxTokenAllowed: 8000 },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: any,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'ANTHROPIC_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    const response = await fetch(`https://api.anthropic.com/v1/models`, {
      headers: {
        'x-api-key': `${apiKey}`,
        'anthropic-version': '2023-06-01',
      },
    });

    const res = (await response.json()) as any;
    const staticModelIds = this.staticModels.map((m) => m.name);

    const data = res.data.filter((model: any) => model.type === 'model' && !staticModelIds.includes(model.id));

    return data.map((m: any) => ({
      name: m.id,
      label: `${m.display_name}`,
      provider: this.name,
      maxTokenAllowed: 32000,
    }));
  }

  // Méthode pour générer du texte avec Anthropic
  async generateText({
    prompt,
    model = 'claude-3-5-sonnet-latest',
    apiKey,
    system
  }: {
    prompt: string;
    model?: string;
    apiKey: string;
    system?: string;
  }): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
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
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.content?.[0]?.text || '';
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
      defaultApiTokenKey: 'ANTHROPIC_API_KEY',
    });
    if (!apiKey) throw new Error('Anthropic API key is required');
    return {
      generate: async (prompt: string, system?: string) => {
        return this.generateText({ prompt, model, apiKey, system });
      }
    };
  }
}
