import { LLMManager } from '@/lib/modules/llm/manager';
import { planSchema } from '@/lib/zodSchemas';
import { Plan } from '@/types/agents';
import { getDemoPlan } from '@/lib/demo-data';
import { detectTechnologies, getTechDependencies } from '@/lib/tech-detector';

export async function PromptAgent(prompt: string): Promise<Plan> {
  // Détecter les technologies mentionnées
  const detectedTechs = detectTechnologies(prompt);
  
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
    const llmManager = LLMManager.getInstance();
    const planText = await llmManager.callModel('Anthropic', 'claude-3-5-sonnet-latest', prompt, system);
    
    // Parser la réponse JSON
    const plan = JSON.parse(planText);
    
    // Ajouter les dépendances détectées
    if (detectedTechs.length > 0) {
      const { dependencies, devDependencies } = getTechDependencies(detectedTechs);
      plan.dependencies = dependencies;
      plan.devDependencies = devDependencies;
      
      // S'assurer que la stack inclut les technologies détectées
      if (!plan.stack) plan.stack = [];
      detectedTechs.forEach(tech => {
        if (!plan.stack.includes(tech)) {
          plan.stack.push(tech);
        }
      });
    }
    
    planSchema.parse(plan); // validation avec zod
    return plan;
  } catch (error) {
    console.error('Error in PromptAgent:', error);
    
    // En cas d'erreur, utiliser le mode démo avec les technologies détectées
    console.log('Using demo mode due to API error');
    return getDemoPlan(prompt);
  }
}