/**
 * User - Interface représentant un utilisateur de l'application
 * 
 * @property {string} id - Identifiant unique de l'utilisateur
 * @property {string} email - Adresse email de l'utilisateur
 * @property {string} name - Nom complet de l'utilisateur
 * @property {string} [avatar] - URL de l'avatar de l'utilisateur (optionnel)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * ProjectPlan - Interface représentant un plan de projet
 * 
 * @property {string} id - Identifiant unique du plan
 * @property {string} title - Titre du projet
 * @property {string} description - Description détaillée du projet
 * @property {string[]} techStack - Tableau des technologies utilisées
 * @property {string[]} features - Liste des fonctionnalités principales
 * @property {string} estimatedTime - Estimation du temps de développement
 * @property {'Low' | 'Medium' | 'High'} complexity - Niveau de complexité du projet
 * @property {Date} createdAt - Date de création du plan
 */
export interface ProjectPlan {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  estimatedTime: string;
  complexity: 'Low' | 'Medium' | 'High';
  createdAt: Date;
}

/**
 * ProjectFile - Interface représentant un fichier dans un projet
 * 
 * @property {string} id - Identifiant unique du fichier
 * @property {string} name - Nom du fichier avec extension
 * @property {'component' | 'page' | 'api' | 'config' | 'style' | 'folder'} type - Type de fichier
 * @property {string} path - Chemin relatif du fichier dans le projet
 * @property {string} size - Taille du fichier formatée (ex: '2.5 KB')
 * @property {Date} lastModified - Date de dernière modification
 * @property {string} [description] - Description optionnelle du fichier
 */
export interface ProjectFile {
  id: string;
  name: string;
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'folder';
  path: string;
  size: string;
  lastModified: Date;
  description?: string;
}

/**
 * UIComponent - Interface représentant un composant d'interface utilisateur
 * 
 * @property {string} id - Identifiant unique du composant
 * @property {string} name - Nom d'affichage du composant
 * @property {'button' | 'form' | 'card' | 'modal' | 'navbar'} type - Type de composant
 * @property {string} preview - URL ou code de prévisualisation du composant
 * @property {Record<string, any>} props - Propriétés configurables du composant
 */
export interface UIComponent {
  id: string;
  name: string;
  type: 'button' | 'form' | 'card' | 'modal' | 'navbar';
  preview: string;
  props: Record<string, any>;
}

/**
 * ProjectPrompt - Interface représentant une demande de génération de projet
 * 
 * @property {string} id - Identifiant unique de la demande
 * @property {string} prompt - Texte de la demande de l'utilisateur
 * @property {Date} createdAt - Date de création de la demande
 * @property {'pending' | 'processing' | 'completed' | 'error'} status - État actuel du traitement
 */
export interface ProjectPrompt {
  id: string;
  prompt: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
}