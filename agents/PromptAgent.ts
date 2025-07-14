// Importation des dépendances nécessaires
// LLMManager: Gestionnaire pour les appels aux modèles de langage
// planSchema: Schéma de validation pour le plan de projet
// Plan: Type TypeScript pour la structure du plan
// getDemoPlan: Fonction pour obtenir un plan de démonstration
// detectTechnologies, getTechDependencies: Outils de détection des technologies
import { LLMManager } from '@/lib/modules/llm/manager';
import { planSchema } from '@/lib/zodSchemas';
import { Plan } from '@/types/agents';
import { getDemoPlan } from '@/lib/demo-data';
import { detectTechnologies, getTechDependencies } from '@/lib/tech-detector';

/**
 * PromptAgent - Agent principal pour la génération de plans de projet basés sur un prompt utilisateur
 * 
 * @param prompt - string - La description du projet ou des fonctionnalités demandées par l'utilisateur
 * 
 * @returns Promise<Plan> - Une promesse qui se résout avec un objet Plan structuré
 * 
 * @description
 * Cet agent est le point d'entrée principal pour transformer une description textuelle
 * en un plan de projet structuré. Il effectue les étapes suivantes :
 * 1. Détecte les technologies mentionnées dans le prompt
 * 2. Construit un prompt système détaillé pour le modèle de langage
 * 3. Appelle le modèle de langage pour générer un plan structuré
 * 4. Valide et enrichit le plan généré
 * 5. Gère les erreurs en basculant vers un mode démo si nécessaire
 */
export async function PromptAgent(prompt: string): Promise<Plan> {
  // Détection automatique des technologies mentionnées dans le prompt utilisateur
  const detectedTechs = detectTechnologies(prompt);
  
  // Construction du prompt système qui guide le modèle de langage
  const system = `Tu es un architecte logiciel expert. Analyse la demande utilisateur et :
  1. Identifie et utilise les technologies suivantes : ${detectedTechs.join(', ') || 'Aucune technologie spécifique détectée'}
  2. Si aucune technologie n'est spécifiée, suggère une stack moderne adaptée
  3. Crée une architecture qui intègre toutes les technologies demandées
  4. Structure la réponse en JSON avec :
     - stack: toutes les technologies identifiées avec leurs versions
     - features: fonctionnalités clés
     - architecture: description de l'architecture
     - steps: étapes de développement détaillées
     - files: fichiers à créer avec leur contenu
     - commands: commandes d'installation et de démarrage
  5. Sois précis sur comment les technologies interagissent entre elles`;
  
  try {
    // Récupération de l'instance du gestionnaire de modèles de langage
    const llmManager = LLMManager.getInstance();
    
    // Appel au modèle de langage Claude 3.5 Sonnet avec le prompt utilisateur et le prompt système
    const planText = await llmManager.callModel('Anthropic', 'claude-3-5-sonnet-latest', prompt, system);
    
    // Conversion de la réponse texte en objet JavaScript
    const plan = JSON.parse(planText);
    
    // Enrichissement du plan avec les dépendances détectées
    if (detectedTechs.length > 0) {
      // Récupération des dépendances pour les technologies détectées
      const { dependencies, devDependencies } = getTechDependencies(detectedTechs);
      
      // Ajout des dépendances au plan
      plan.dependencies = dependencies;
      plan.devDependencies = devDependencies;
      
      // S'assurer que toutes les technologies détectées sont incluses dans la stack
      if (!plan.stack) plan.stack = [];
      detectedTechs.forEach(tech => {
        if (!plan.stack.includes(tech)) {
          plan.stack.push(tech);
        }
      });
    }
    
    // Validation du plan généré par rapport au schéma défini
    planSchema.parse(plan);
    
    return plan;
  } catch (error) {
    // Gestion des erreurs
    console.error('Error in PromptAgent:', error);
    
    // En cas d'échec, bascule vers un mode démo avec les technologies détectées
    console.log('Using demo mode due to API error');
    return getDemoPlan(prompt);
  }
}