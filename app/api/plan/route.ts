import { PromptAgent } from '@/agents/PromptAgent';
import { NextRequest, NextResponse } from 'next/server';
import { llmService } from '@/services/llm';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt manquant ou invalide.' }, { status: 400 });
    }

    const plan = await PromptAgent(prompt);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in /api/plan:', error);
    
    return NextResponse.json({ 
      error: 'Erreur lors de la génération du plan.',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 