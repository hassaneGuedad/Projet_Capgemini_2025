import { Plan, GeneratedFile } from "./agents";

/**
 * @example
 * // Exemple d'utilisation de ProjectMeta
 * const project: ProjectMeta = {
 *   id: 'proj_123',
 *   userId: 'user_456',
 *   prompt: 'Créer une application de gestion de tâches',
 *   plan: {
 *     stack: ['React', 'TypeScript'],
 *     steps: ['Initialisation', 'Développement', 'Test'],
 *     features: ['Authentification', 'Gestion des tâches'],
 *     files: [],
 *     commands: ['npm install', 'npm start']
 *   },
 *   files: [{
 *     path: 'index.html',
 *     content: '<!DOCTYPE html>'
 *   }],
 *   deployedUrl: 'https://mon-projet.netlify.app',
 *   createdAt: '2025-07-14T15:30:00Z'
 * };
 */

export interface ProjectMeta {
  id: string;
  userId: string;
  prompt: string;
  plan: Plan;
  files: GeneratedFile[];
  deployedUrl?: string;
  createdAt: string;
}