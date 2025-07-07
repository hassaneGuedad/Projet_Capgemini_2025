import { DeployAgent } from "@/agents/DeployAgent";
import { updateProject } from "@/services/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { files, siteName, projectId } = await req.json();
  const deployedUrl = await DeployAgent(files, siteName);
  await updateProject(projectId, { deployedUrl });
  return NextResponse.json({ deployedUrl });
}