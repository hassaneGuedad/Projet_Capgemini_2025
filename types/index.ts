export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

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

export interface ProjectFile {
  id: string;
  name: string;
  type: 'component' | 'page' | 'api' | 'config' | 'style';
  path: string;
  size: string;
  lastModified: Date;
  description?: string;
}

export interface UIComponent {
  id: string;
  name: string;
  type: 'button' | 'form' | 'card' | 'modal' | 'navbar';
  preview: string;
  props: Record<string, any>;
}

export interface ProjectPrompt {
  id: string;
  prompt: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
}