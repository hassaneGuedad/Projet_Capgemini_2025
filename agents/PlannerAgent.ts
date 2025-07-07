import { Plan } from "@/types/agents";

export async function PlannerAgent(plan: Plan) {
  // Ici, tu pourrais enrichir la structure, ajouter des fichiers, etc.
  return plan.files;
}