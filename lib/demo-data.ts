import { Plan } from '@/types/agents';
import { detectTechnologies } from './tech-detector';

export const demoPlans: Record<string, Plan> = {
  'react-node': {
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    features: [
      'Application complète full-stack',
      'API REST avec Express',
      'Base de données MongoDB',
      'Interface utilisateur réactive',
      'Gestion d\'état avec Context API',
      'Architecture client-serveur avec séparation des préoccupations'
    ],
    steps: [
      'Initialiser le projet frontend avec Vite + React',
      'Configurer le backend Node.js/Express',
      'Connecter MongoDB avec Mongoose',
      'Créer les modèles de données',
      'Développer les routes API',
      'Implémenter l\'authentification JWT',
      'Développer les composants React',
      'Configurer le routage avec React Router',
      'Tester l\'application complète'
    ],
    files: [
      // Fichiers frontend
      { path: 'frontend/package.json', description: 'Dépendances frontend' },
      { path: 'frontend/src/App.jsx', description: 'Composant principal' },
      { path: 'frontend/src/components/', description: 'Composants React' },
      { path: 'frontend/src/context/', description: 'Contexte React' },
      
      // Fichiers backend
      { path: 'backend/package.json', description: 'Dépendances backend' },
      { path: 'backend/src/server.js', description: 'Point d\'entrée du serveur' },
      { path: 'backend/src/routes/', description: 'Routes API' },
      { path: 'backend/src/models/', description: 'Modèles de données' },
      { path: 'backend/.env', description: 'Variables d\'environnement' }
    ],
    commands: [
      '# Frontend',
      'mkdir -p frontend && cd frontend',
      'npm create vite@latest . -- --template react',
      'npm install axios react-router-dom',
      'npm install -D tailwindcss postcss autoprefixer',
      'npx tailwindcss init -p',
      '',
      '# Backend',
      'cd .. && mkdir -p backend && cd backend',
      'npm init -y',
      'npm install express mongoose dotenv cors jsonwebtoken bcryptjs',
      'npm install -D nodemon',
      '',
      '# Démarrer les serveurs',
      '# Dans le terminal 1: cd frontend && npm run dev',
      '# Dans le terminal 2: cd backend && npm run dev'
    ]
  },
  'nextjs': {
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    features: [
      'Rendu côté serveur (SSR)',
      'Typage fort avec TypeScript',
      'Base de données relationnelle',
      'Authentification',
      'API Routes intégrées',
      'Application moderne avec Next.js en full-stack',
      'Pages rendues côté serveur pour performances optimales',
      'Intégration avec Prisma ORM'
    ],
    steps: [
      'Créer un nouveau projet Next.js avec TypeScript',
      'Configurer Tailwind CSS',
      'Mettre en place Prisma et se connecter à PostgreSQL',
      'Définir les modèles de données',
      'Créer les pages principales',
      'Implémenter l\'authentification',
      'Développer les composants UI',
      'Configurer les API Routes',
      'Tester et déployer sur Vercel'
    ],
    files: [
      { path: 'package.json', description: 'Dépendances du projet' },
      { path: 'prisma/schema.prisma', description: 'Schéma de la base de données' },
      { path: 'src/pages/_app.tsx', description: 'Composant principal de l\'application' },
      { path: 'src/pages/api/', description: 'Routes API' },
      { path: 'src/components/', description: 'Composants partagés' },
      { path: 'src/styles/', description: 'Feuilles de style globales' },
      { path: '.env', description: 'Variables d\'environnement' }
    ],
    commands: [
      '# Créer un nouveau projet Next.js',
      'npx create-next-app@latest my-nextjs-app --typescript',
      'cd my-nextjs-app',
      '',
      '# Installer les dépendances',
      'npm install @prisma/client @auth/prisma-adapter next-auth',
      'npm install -D prisma @types/node @types/react @types/react-dom',
      '',
      '# Initialiser Prisma',
      'npx prisma init',
      '',
      '# Démarrer le serveur de développement',
      'npm run dev'
    ]
  },
  'vue-nuxt': {
    stack: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Pinia', 'Tailwind CSS'],
    features: [
      'Framework Vue.js universel',
      'Rendu côté serveur (SSR)',
      'Gestion d\'état avec Pinia',
      'Routing automatique',
      'Optimisation des performances',
      'Architecture universelle avec partage de code client/serveur',
      'Gestion d\'état avancée avec Pinia'
    ],
    steps: [
      'Créer un nouveau projet Nuxt.js',
      'Configurer TypeScript et Tailwind CSS',
      'Mettre en place Pinia pour la gestion d\'état',
      'Créer les pages et les composants',
      'Implémenter le routage',
      'Configurer les plugins',
      'Optimiser les performances',
      'Tester et déployer'
    ],
    files: [
      { path: 'nuxt.config.ts', description: 'Configuration Nuxt.js' },
      { path: 'app.vue', description: 'Point d\'entrée de l\'application' },
      { path: 'pages/', description: 'Pages de l\'application' },
      { path: 'components/', description: 'Composants réutilisables' },
      { path: 'composables/', description: 'Composables Vue 3' },
      { path: 'stores/', description: 'Stores Pinia' },
      { path: 'public/', description: 'Fichiers statiques' }
    ],
    commands: [
      '# Créer un nouveau projet Nuxt',
      'npx nuxi@latest init my-nuxt-app',
      'cd my-nuxt-app',
      '',
      '# Installer les dépendances',
      'npm install @pinia/nuxt @nuxtjs/tailwindcss',
      '',
      '# Démarrer le serveur de développement',
      'npm run dev',
      '',
      '# Pour la production',
      'npm run build',
      'npm run start'
    ]
  },
  'portfolio': {
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    features: [
      'Page d\'accueil moderne',
      'Section projets interactive',
      'Section compétences',
      'Formulaire de contact',
      'Animations fluides',
      'SEO optimisé'
    ],
    steps: [
      'Créer le projet Next.js',
      'Configurer TypeScript et Tailwind',
      'Créer les composants de layout',
      'Développer les sections principales',
      'Ajouter les animations',
      'Optimiser les performances',
      'Déployer sur Vercel'
    ],
    files: [
      { path: 'package.json', description: 'Configuration du projet Next.js' },
      { path: 'next.config.js', description: 'Configuration Next.js' },
      { path: 'tsconfig.json', description: 'Configuration TypeScript' },
      { path: 'src/app/layout.tsx', description: 'Layout principal de l\'application' },
      { path: 'src/app/page.tsx', description: 'Page d\'accueil' },
      { path: 'src/components/Header.tsx', description: 'Composant header' },
      { path: 'src/components/Hero.tsx', description: 'Section hero' },
      { path: 'src/components/Projects.tsx', description: 'Section projets' },
      { path: 'src/components/Skills.tsx', description: 'Section compétences' },
      { path: 'src/components/Contact.tsx', description: 'Section contact' },
      { path: 'tailwind.config.ts', description: 'Configuration Tailwind CSS' }
    ],
    commands: [
      'npx create-next-app@latest portfolio --typescript --tailwind --eslint',
      'cd portfolio',
      'npm install framer-motion',
      'npm run dev'
    ]
  },
  'weather-app': {
    stack: ['React', 'TypeScript', 'OpenWeatherMap API', 'Tailwind CSS'],
    features: [
      'Affichage météo en temps réel',
      'Recherche par ville',
      'Prévisions sur 5 jours',
      'Interface responsive',
      'Géolocalisation'
    ],
    steps: [
      'Initialiser le projet React',
      'Configurer l\'API OpenWeatherMap',
      'Créer les composants météo',
      'Implémenter la recherche',
      'Ajouter les prévisions',
      'Styliser l\'interface',
      'Tester et déployer'
    ],
    files: [
      { path: 'package.json', description: 'Configuration du projet React' },
      { path: 'tsconfig.json', description: 'Configuration TypeScript' },
      { path: 'src/App.tsx', description: 'Composant principal' },
      { path: 'src/components/WeatherCard.tsx', description: 'Carte météo' },
      { path: 'src/components/SearchBar.tsx', description: 'Barre de recherche' },
      { path: 'src/components/Forecast.tsx', description: 'Composant prévisions' },
      { path: 'src/services/weatherApi.ts', description: 'Service API météo' },
      { path: 'src/types/weather.ts', description: 'Types météo' },
      { path: 'tailwind.config.js', description: 'Configuration Tailwind CSS' }
    ],
    commands: [
      'npm create vite@latest weather-app -- --template react-ts',
      'cd weather-app',
      'npm install',
      'npm install -D tailwindcss postcss autoprefixer',
      'npm install axios',
      'npx tailwindcss init -p'
    ]
  }
};

export function getDemoPlan(prompt: string): Plan {
  // Détecter les technologies dans le prompt
  const techs = detectTechnologies(prompt);
  
  // Si des technologies spécifiques sont mentionnées, essayer de trouver un plan correspondant
  if (techs.length > 0) {
    // Essayer de trouver un plan qui correspond aux technologies détectées
    const matchingPlan = Object.entries(demoPlans).find(([_, plan]) => {
      const planTechs = plan.stack.map(t => t.toLowerCase());
      return techs.some(tech => planTechs.includes(tech));
    });
    
    if (matchingPlan) {
      return matchingPlan[1];
    }
    
    // Si pas de correspondance exacte, personnaliser un plan de base
    return {
      stack: techs.map(tech => tech.charAt(0).toUpperCase() + tech.slice(1)),
      features: [
        `Application utilisant ${techs.join(' et ')}`,
        'Interface utilisateur réactive',
        'Gestion des données',
        'API REST',
        `Architecture basée sur ${techs.join(' et ')}`
      ],
      steps: [
        'Initialiser le projet',
        'Configurer les dépendances',
        'Créer la structure de base',
        'Développer les fonctionnalités principales',
        'Tester et déployer'
      ],
      files: [
        { path: 'package.json', description: 'Configuration du projet' },
        { path: 'src/', description: 'Code source principal' },
        { path: 'public/', description: 'Fichiers statiques' }
      ],
      commands: [
        '# Installer les dépendances',
        'npm install',
        '',
        '# Démarrer le serveur de développement',
        'npm run dev'
      ]
    };
  }
  
  // Par défaut, retourner le plan React/Node
  return demoPlans['react-node'];
}