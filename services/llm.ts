import { LLMManager } from '@/lib/modules/llm/manager';

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

  async callClaude(prompt: string, system?: string): Promise<string> {
    try {
      return await this.llmManager.callModel('Anthropic', 'claude-3-5-sonnet-latest', prompt, system);
    } catch (error) {
      console.error('Error calling Claude:', error);
      throw error;
    }
  }

  async callModel(provider: string, model: string, prompt: string, system?: string): Promise<string> {
    try {
      return await this.llmManager.callModel(provider, model, prompt, system);
    } catch (error) {
      console.error(`Error calling ${provider}/${model}:`, error);
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

// Fonction de compatibilité avec l'ancien service
export async function callClaude(prompt: string, system?: string): Promise<string> {
  const llmService = LLMService.getInstance();
  return await llmService.callClaude(prompt, system);
} 