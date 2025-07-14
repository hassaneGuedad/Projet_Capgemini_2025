/**
 * Plan - Interface représentant la structure d'un plan de projet
 * 
 * @property {string[]} stack - Tableau des technologies utilisées dans le projet
 * @property {string[]} steps - Étapes à suivre pour la réalisation du projet
 * @property {string[]} features - Fonctionnalités principales du projet
 * @property {FilePlan[]} files - Liste des fichiers à générer
 * @property {string[]} commands - Commandes à exécuter pour configurer le projet
 */
export interface Plan {
  stack: string[];
  steps: string[];
  features: string[];
  files: FilePlan[];
  commands: string[];
}

/**
 * FilePlan - Interface décrivant un fichier à générer
 * 
 * @property {string} path - Chemin relatif du fichier (ex: 'src/components/Button.tsx')
 * @property {string} description - Description du contenu attendu du fichier
 */
export interface FilePlan {
  path: string;
  description: string;
}

/**
 * GeneratedFile - Interface représentant un fichier généré
 * 
 * @property {string} path - Chemin relatif du fichier
 * @property {string} content - Contenu brut du fichier généré
 */
export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * Project - Interface représentant un projet complet
 * 
 * @property {string} id - Identifiant unique du projet
 * @property {string} userId - Identifiant de l'utilisateur propriétaire
 * @property {string} prompt - Prompt original ayant généré le projet
 * @property {Plan} plan - Plan détaillé du projet
 * @property {GeneratedFile[]} files - Fichiers générés pour le projet
 * @property {string} [deployedUrl] - URL du projet déployé (optionnel)
 * @property {string} createdAt - Date de création au format ISO
 */
export interface Project {
  id: string;
  userId: string;
  prompt: string;
  plan: Plan;
  files: GeneratedFile[];
  deployedUrl?: string;
  createdAt: string;
}