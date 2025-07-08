import { getUserProjects, deleteProject } from "@/services/firestore";
import { NextRequest, NextResponse } from "next/server";

//Gestion des projets (récupération et suppression

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const projects = await getUserProjects(userId);
  return NextResponse.json(projects);
}

export async function DELETE(req: NextRequest) {
  const { projectId } = await req.json();
  await deleteProject(projectId);
  return NextResponse.json({ success: true });
}