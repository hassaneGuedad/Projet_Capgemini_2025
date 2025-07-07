import type { ModelInfo, ProviderInfo, ProviderConfig } from './types';

export abstract class BaseProvider implements ProviderInfo {
  abstract name: string;
  abstract staticModels: ModelInfo[];
  abstract config: ProviderConfig;
  cachedDynamicModels?: {
    cacheId: string;
    models: ModelInfo[];
  };

  getApiKeyLink?: string;
  labelForGetApiKey?: string;
  icon?: string;

  getProviderBaseUrlAndKey(options: {
    apiKeys?: Record<string, string>;
    providerSettings?: any;
    serverEnv?: Record<string, string>;
    defaultBaseUrlKey: string;
    defaultApiTokenKey: string;
  }) {
    const { apiKeys, providerSettings, serverEnv, defaultBaseUrlKey, defaultApiTokenKey } = options;
    let settingsBaseUrl = providerSettings?.baseUrl;

    if (settingsBaseUrl && settingsBaseUrl.length == 0) {
      settingsBaseUrl = undefined;
    }

    const baseUrlKey = this.config.baseUrlKey || defaultBaseUrlKey;
    let baseUrl =
      settingsBaseUrl ||
      serverEnv?.[baseUrlKey] ||
      process?.env?.[baseUrlKey] ||
      this.config.baseUrl;

    if (baseUrl && baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const apiTokenKey = this.config.apiTokenKey || defaultApiTokenKey;
    const apiKey =
      apiKeys?.[this.name] || serverEnv?.[apiTokenKey] || process?.env?.[apiTokenKey];

    return {
      baseUrl,
      apiKey,
    };
  }

  getModelsFromCache(options: {
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
    serverEnv?: Record<string, string>;
  }): ModelInfo[] | null {
    if (!this.cachedDynamicModels) {
      return null;
    }

    const cacheKey = this.cachedDynamicModels.cacheId;
    const generatedCacheKey = this.getDynamicModelsCacheKey(options);

    if (cacheKey !== generatedCacheKey) {
      this.cachedDynamicModels = undefined;
      return null;
    }

    return this.cachedDynamicModels.models;
  }

  getDynamicModelsCacheKey(options: {
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
    serverEnv?: Record<string, string>;
  }) {
    return JSON.stringify({
      apiKeys: options.apiKeys?.[this.name],
      providerSettings: options.providerSettings?.[this.name],
      serverEnv: options.serverEnv,
    });
  }

  storeDynamicModels(
    options: {
      apiKeys?: Record<string, string>;
      providerSettings?: Record<string, any>;
      serverEnv?: Record<string, string>;
    },
    models: ModelInfo[],
  ) {
    const cacheId = this.getDynamicModelsCacheKey(options);
    this.cachedDynamicModels = {
      cacheId,
      models,
    };
  }

  // Declare the optional getDynamicModels method
  getDynamicModels?(
    apiKeys?: Record<string, string>,
    settings?: any,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]>;

  abstract getModelInstance(options: {
    model: string;
    serverEnv?: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
  }): any;
}
