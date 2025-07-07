export interface Plan {
    stack: string[];
    steps: string[];
    features: string[];
    files: FilePlan[];
    commands: string[];
  }
  
  export interface FilePlan {
    path: string;
    description: string;
  }
  
  export interface GeneratedFile {
    path: string;
    content: string;
  }
  
  export interface Project {
    id: string;
    userId: string;
    prompt: string;
    plan: Plan;
    files: GeneratedFile[];
    deployedUrl?: string;
    createdAt: string;
  }