import { TECH_CONFIG } from './tech-config';
import type { TechId } from './tech-config';

const TECH_MAPPING: Record<string, TechId> = {
  // React
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  
  // Vue
  'vue': 'vue',
  'vuejs': 'vue',
  'vue.js': 'vue',
  
  // Node.js
  'node': 'node',
  'nodejs': 'node',
  'node.js': 'node',
  
  // MongoDB
  'mongodb': 'mongodb',
  'mongo': 'mongodb',
  
  // PostgreSQL
  'postgresql': 'postgresql',
  'postgres': 'postgresql',
  'pg': 'postgresql',
  
  // Tailwind CSS
  'tailwind': 'tailwind',
  'tailwindcss': 'tailwind',
  'tailwind css': 'tailwind',
  
  // Firebase
  'firebase': 'firebase',
  
  // Next.js
  'next': 'next',
  'nextjs': 'next',
  'next.js': 'next',
  
  // TypeScript
  'typescript': 'typescript',
  'ts': 'typescript',
  
  // Express
  'express': 'express',
  'expressjs': 'express',
  'express.js': 'express'
};

export function detectTechnologies(prompt: string): TechId[] {
  const lowerPrompt = prompt.toLowerCase();
  const detectedTechs = new Set<TechId>();

  // Détecter les technologies mentionnées
  for (const [keyword, techId] of Object.entries(TECH_MAPPING)) {
    if (lowerPrompt.includes(keyword)) {
      detectedTechs.add(techId);
    }
  }

  // Détection supplémentaire basée sur des motifs
  if (/\bnode\s*[\+\s]*js\b/i.test(prompt) && !detectedTechs.has('node')) {
    detectedTechs.add('node');
  }

  return Array.from(detectedTechs);
}

export function getTechDisplayName(techId: TechId): string {
  return TECH_CONFIG[techId]?.name || techId;
}

export function getTechIcon(techId: TechId): string {
  return TECH_CONFIG[techId]?.icon || '🔧';
}

// Export the TechId type for use in other files
export type { TechId };

export function getTechDependencies(techIds: TechId[]): {
  dependencies: string[];
  devDependencies: string[];
} {
  const result = {
    dependencies: new Set<string>(),
    devDependencies: new Set<string>()
  };

  techIds.forEach(techId => {
    const tech = TECH_CONFIG[techId];
    if (!tech) return;

    tech.dependencies?.forEach(dep => result.dependencies.add(dep));
    tech.devDependencies?.forEach(dep => result.devDependencies.add(dep));
  });

  return {
    dependencies: Array.from(result.dependencies),
    devDependencies: Array.from(result.devDependencies)
  };
}
