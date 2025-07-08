import { Plan } from "@/types/agents";

export async function PlannerAgent(plan: Plan) {
  // Ici, je peux enrichir la structure, ajouter des fichiers.
  return plan.files;
}