import type { LanguageModelV1 } from 'ai';
import type { IProviderSetting } from '~/types/model';

export interface ModelInfo {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
}

export interface ProviderInfo {
  name: string;
  staticModels: ModelInfo[];
  config: ProviderConfig;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
  icon?: string;
  getDynamicModels?(
    apiKeys?: Record<string, string>,
    settings?: any,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]>;
}

export interface ProviderConfig {
  apiTokenKey: string;
  baseUrlKey?: string;
  baseUrl?: string;
}
