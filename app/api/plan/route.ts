import { PromptAgent } from '@/agents/PromptAgent';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt manquant ou invalide.' }, { status: 400 });
    }

    // Vérifier si la clé API est configurée
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'Configuration API manquante. Veuillez configurer CLAUDE_API_KEY dans .env.local' 
      }, { status: 500 });
    }

    const plan = await PromptAgent(prompt);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in /api/plan:', error);
    
    // Gestion d'erreur plus détaillée
    if (error instanceof Error) {
      if (error.message.includes('CLAUDE_API_KEY')) {
        return NextResponse.json({ 
          error: 'Clé API Claude non configurée. Veuillez ajouter CLAUDE_API_KEY dans .env.local' 
        }, { status: 500 });
      }
      
      if (error.message.includes('JSON')) {
        return NextResponse.json({ 
          error: 'Erreur de parsing JSON de la réponse Claude' 
        }, { status: 500 });
      }

      if (error.message.includes('credit balance')) {
        return NextResponse.json({ 
          error: 'Crédits Anthropic insuffisants. Veuillez recharger votre compte ou utiliser un mode de démonstration.' 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Erreur lors de la génération du plan.',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 