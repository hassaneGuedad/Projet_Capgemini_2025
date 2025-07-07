import { BaseProvider } from './base-provider';
import type { ModelInfo } from './types';

export default class AnthropicProvider extends BaseProvider {
  name = 'Anthropic';
  getApiKeyLink = 'https://console.anthropic.com/settings/keys';

  config = {
    apiTokenKey: 'CLAUDE_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'claude-3-5-sonnet-latest',
      label: 'Claude 3.5 Sonnet (latest)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-5-sonnet-20240620',
      label: 'Claude 3.5 Sonnet (stable)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-5-haiku-latest',
      label: 'Claude 3.5 Haiku (latest)',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-sonnet-20240229',
      label: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
    {
      name: 'claude-3-haiku-20240307',
      label: 'Claude 3 Haiku',
      provider: 'Anthropic',
      maxTokenAllowed: 8000,
    },
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
      defaultApiTokenKey: 'CLAUDE_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    try {
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
    } catch (error) {
      console.error('Error fetching dynamic models from Anthropic:', error);
      return [];
    }
  }

  getModelInstance: (options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
  }) => any = (options) => {
    const { apiKeys, providerSettings, serverEnv, model } = options;
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'CLAUDE_API_KEY',
    });

    // Retourner une interface compatible avec notre système
    return {
      model,
      apiKey,
      provider: this.name,
      async generate(prompt: string, system?: string) {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          };
          if (apiKey) headers['x-api-key'] = apiKey;
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: model,
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
          return data.content[0].text;
        } catch (error) {
          console.error('Error calling Anthropic API:', error);
          throw error;
        }
      }
    };
  };
} 