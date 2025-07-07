import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generatePlanFromPrompt(prompt: string) {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Erreur lors de la génération du plan');
  return await res.json();
}

export async function generateProjectFromPrompt(plan: any, prompt: string, userId?: string) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, prompt, userId }),
  });
  if (!res.ok) throw new Error('Erreur lors de la génération du projet');
  return await res.json();
}

export async function exportProjectAsZip(files: any[], projectName?: string) {
  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files, projectName }),
  });
  
  if (!res.ok) {
    throw new Error('Erreur lors de l\'export du projet');
  }
  
  // Créer un blob et déclencher le téléchargement
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName || 'generated-project'}.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
