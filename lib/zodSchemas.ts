import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(10, "Le prompt doit faire au moins 10 caractères"),
});

export const planSchema = z.object({
  stack: z.array(z.string()),
  steps: z.array(z.string()),
  features: z.array(z.string()),
  files: z.array(z.object({
    path: z.string(),
    description: z.string(),
  })),
  commands: z.array(z.string()),
});