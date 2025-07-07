export const TECH_CONFIG = {
  'react': {
    name: 'React',
    description: 'Bibliothèque JavaScript pour les interfaces utilisateur',
    icon: '⚛️',
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@vitejs/plugin-react', '@types/react', '@types/react-dom']
  },
  'vue': {
    name: 'Vue.js',
    description: 'Framework JavaScript progressif',
    icon: '🟢',
    dependencies: ['vue'],
    devDependencies: ['@vitejs/plugin-vue', '@vitejs/plugin-vue-jsx']
  },
  'node': {
    name: 'Node.js',
    description: 'Environnement d\'exécution JavaScript côté serveur',
    icon: '🟩',
    dependencies: ['express', 'cors'],
    devDependencies: ['nodemon', '@types/node', '@types/express', '@types/cors']
  },
  'mongodb': {
    name: 'MongoDB',
    description: 'Base de données NoSQL orientée documents',
    icon: '🍃',
    dependencies: ['mongoose'],
    devDependencies: ['@types/mongoose']
  },
  'postgresql': {
    name: 'PostgreSQL',
    description: 'Système de gestion de base de données relationnelle',
    icon: '🐘',
    dependencies: ['pg', 'typeorm'],
    devDependencies: ['@types/pg']
  },
  'tailwind': {
    name: 'Tailwind CSS',
    description: 'Framework CSS utilitaire',
    icon: '🎨',
    dependencies: ['tailwindcss', 'postcss', 'autoprefixer'],
    devDependencies: []
  },
  'firebase': {
    name: 'Firebase',
    description: 'Plateforme de développement d\'applications',
    icon: '🔥',
    dependencies: ['firebase'],
    devDependencies: []
  },
  'next': {
    name: 'Next.js',
    description: 'Framework React pour le rendu côté serveur',
    icon: '⏭️',
    dependencies: ['next'],
    devDependencies: ['@types/node', '@types/react', '@types/react-dom']
  },
  'typescript': {
    name: 'TypeScript',
    description: 'Sur-ensemble typé de JavaScript',
    icon: '🔷',
    dependencies: ['typescript'],
    devDependencies: ['@types/node', '@types/react', '@types/react-dom']
  },
  'express': {
    name: 'Express',
    description: 'Framework web pour Node.js',
    icon: '🚂',
    dependencies: ['express'],
    devDependencies: ['@types/express', '@types/node']
  }
} as const;

export type TechId = keyof typeof TECH_CONFIG;
