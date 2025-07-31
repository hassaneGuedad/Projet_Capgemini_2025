import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@/services/llm';

export async function POST(req: NextRequest) {
  try {
    const { prompt, system, model } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt manquant ou invalide.' }, { status: 400 });
    }
    // Par défaut : deepseek
    let provider = 'DeepSeek';
    let modelName = 'deepseek-chat';
    if (model === 'claude-sonnet' || model === 'claude') {
      provider = 'Anthropic';
      modelName = 'claude-3-5-sonnet-latest';
    }
    const result = await LLMService.getInstance().callModel(provider, modelName, prompt, system);
    return NextResponse.json({ content: [{ text: result }] });
  } catch (error) {
    console.error('Erreur LLM API:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, { status: 500 });
  }
}
