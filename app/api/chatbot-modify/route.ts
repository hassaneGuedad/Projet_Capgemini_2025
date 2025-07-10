import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@/services/llm';

export async function POST(req: NextRequest) {
  try {
    const { code, instruction, filename } = await req.json();

    // Détection naïve d'une demande d'explication
    const wantsExplanation = /expli|explain|pourquoi|comment|what does|explanation/i.test(instruction);

    let prompt = '';
    if (wantsExplanation) {
      prompt = `
Voici le code du fichier ${filename} :
\`\`\`
${code}
\`\`\`
${instruction}
Donne uniquement une explication détaillée en français, sans reproduire le code, même si l'utilisateur demande du code. Ne donne jamais de code dans ta réponse.
      `;
    } else {
      prompt = `
Voici le code du fichier ${filename} :
\`\`\`
${code}
\`\`\`
Instruction utilisateur : ${instruction}
Renvoie uniquement le code modifié, sans explication.
      `;
    }

    const modifiedCode = await LLMService.getInstance().callDeepSeek(prompt);
    return NextResponse.json({ modifiedCode });
  } catch (error) {
    console.error('Erreur dans /api/chatbot-modify:', error);
    return NextResponse.json(
      { error: error?.toString() || 'Erreur inconnue' },
      { status: 500 }
    );
  }
}