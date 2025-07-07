import { BaseProvider } from './base-provider';
import type { ModelInfo } from './types';
import AnthropicProvider from './anthropic-provider';

export class LLMManager {
  private static _instance: LLMManager;
  private _providers: Map<string, BaseProvider> = new Map();
  private _modelList: ModelInfo[] = [];

  private constructor() {
    this._registerProviders();
  }

  static getInstance(): LLMManager {
    if (!LLMManager._instance) {
      LLMManager._instance = new LLMManager();
    }
    return LLMManager._instance;
  }

  private _registerProviders() {
    // Enregistrer le provider Anthropic
    const anthropicProvider = new AnthropicProvider();
    this.registerProvider(anthropicProvider);
  }

  registerProvider(provider: BaseProvider) {
    if (this._providers.has(provider.name)) {
      console.warn(`Provider ${provider.name} is already registered. Skipping.`);
      return;
    }

    console.log('Registering Provider: ', provider.name);
    this._providers.set(provider.name, provider);
    this._modelList = [...this._modelList, ...provider.staticModels];
  }

  getProvider(name: string): BaseProvider | undefined {
    return this._providers.get(name);
  }

  getAllProviders(): BaseProvider[] {
    return Array.from(this._providers.values());
  }

  getModelList(): ModelInfo[] {
    return this._modelList;
  }

  async getModelInstance(providerName: string, modelName: string) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    const apiKey = process.env[provider.config.apiTokenKey];
    if (!apiKey) {
      throw new Error(`API key not found for provider ${providerName}`);
    }

    return provider.getModelInstance({
      model: modelName,
      serverEnv: process.env,
      apiKeys: { [providerName]: apiKey },
    });
  }

  async callModel(providerName: string, modelName: string, prompt: string, system?: string) {
    const modelInstance = await this.getModelInstance(providerName, modelName);
    return await modelInstance.generate(prompt, system);
  }
}
