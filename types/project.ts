import { Plan, GeneratedFile } from "./agents";

export interface ProjectMeta {
  id: string;
  userId: string;
  prompt: string;
  plan: Plan;
  files: GeneratedFile[];
  deployedUrl?: string;
  createdAt: string;
}