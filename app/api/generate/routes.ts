import { PlannerAgent } from "@/agents/PlannerAgent";
import { CodeAgent } from "@/agents/CodeAgent";
import { ValidatorAgent } from "@/agents/ValidatorAgent";
import { saveProject } from "@/services/firestore";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // On attend maintenant un plan validé en body
  const { plan, prompt, userId } = await req.json();
  const filesPlan = await PlannerAgent(plan);

  const files = [];
  for (const filePlan of filesPlan) {
    const file = await CodeAgent(filePlan);
    if (await ValidatorAgent(file)) {
      files.push(file);
    }
  }

  const project = {
    id: uuidv4(),
    userId,
    prompt,
    plan,
    files,
    createdAt: new Date().toISOString(),
  };

  await saveProject(project);

  return NextResponse.json(project);
}