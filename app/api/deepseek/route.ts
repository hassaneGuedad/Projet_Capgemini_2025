import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@/services/llm';

export async function POST(req: NextRequest) {
  try {
    const { prompt, system } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt manquant ou invalide.' }, { status: 400 });
    }
    const result = await LLMService.getInstance().callDeepSeek(prompt, system);
    return NextResponse.json({ content: [{ text: result }] });
  } catch (error) {
    console.error('Erreur DeepSeek API:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, { status: 500 });
  }
}
