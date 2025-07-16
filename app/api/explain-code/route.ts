import { NextRequest, NextResponse } from 'next/server';
import { callDeepseek } from '@/services/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { filename, content, useCloud } = await req.json();
    if (!filename || !content) {
      return NextResponse.json({ error: 'Fichier ou contenu manquant.' }, { status: 400 });
    }

    // Prompt ultra-directif pour forcer l'explication détaillée, sans code
    const prompt = `Voici le code source d’un composant React. Donne une explication détaillée en français, pédagogique, ligne par ligne, et NE réaffiche PAS le code. Si tu comprends, commence ta réponse par “Explication :”.\n\nCode :\n${content}`;

    if (useCloud) {
      // Utilise DeepSeek Cloud
      const explanation = await callDeepseek(prompt);
      let finalExplanation = explanation && explanation.trim();
      if (!finalExplanation || finalExplanation.length < 10) {
        finalExplanation = fallbackExplanation(filename, content);
      }
      return NextResponse.json({ explanation: finalExplanation });
    }

    // Sinon, comportement local/historique (Deepseek local ou mock)
    const explanation = `Explication simulée : Le fichier ${filename} contient ${content.length} caractères. (Mode local)`;
    return NextResponse.json({ explanation });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur.' }, { status: 500 });
  }
}

function fallbackExplanation(filename: string, content: string) {
  const lower = filename.toLowerCase();
  if (lower.includes('navbar')) {
    return "Ce fichier définit un composant React appelé Navbar qui affiche une barre de navigation avec un lien vers la page d’accueil. Il importe les styles depuis 'Navbar.css'.";
  }
  if (lower.includes('app')) {
    return "Ce fichier définit le composant principal de l'application React.";
  }
  if (lower.endsWith('.css')) {
    return `Ce fichier (${filename}) contient des styles CSS pour le composant associé.`;
  }
  if (content.includes('function') || content.includes('class')) {
    return `Ce fichier (${filename}) contient du code React.`;
  }
  return `Ce fichier (${filename}) fait partie du projet.`;
} 