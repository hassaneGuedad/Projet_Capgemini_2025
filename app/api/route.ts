import { PromptAgent } from '@/agents/PromptAgent';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'Prompt manquant ou invalide.' }, { status: 400 });
  }
  try {
    const plan = await PromptAgent(prompt);
    return NextResponse.json({ plan });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la génération du plan.' }, { status: 500 });
  }
} 