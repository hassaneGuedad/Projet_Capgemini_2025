import { ProjectPlan, ProjectFile, UIComponent } from '@/types';

export const mockProjectPlan: ProjectPlan = {
  id: '1',
  title: 'Application E-commerce Moderne',
  description: 'Une application e-commerce complète avec gestion des produits, panier, paiement et tableau de bord administrateur. Développée avec les dernières technologies web pour une expérience utilisateur optimale.',
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Prisma',
    'PostgreSQL',
    'Stripe',
    'NextAuth.js',
    'Vercel',
    'Shadcn/ui',
    'React Hook Form',
    'Zod'
  ],
  features: [
    'Catalogue de produits avec recherche et filtres avancés',
    'Système de panier et wishlist',
    'Intégration paiement sécurisé avec Stripe',
    'Authentification et gestion des utilisateurs',
    'Tableau de bord administrateur complet',
    'Gestion des commandes et statuts',
    'Système de reviews et évaluations',
    'Notifications en temps réel',
    'Interface responsive et moderne',
    'Optimisations SEO intégrées',
    'Analytics et reporting',
    'Gestion des stocks automatisée'
  ],
  estimatedTime: '8-12 semaines',
  complexity: 'High',
  createdAt: new Date('2024-01-15')
};

export const mockProjectFiles: ProjectFile[] = [
  {
    id: '1',
    name: 'layout.tsx',
    type: 'page',
    path: '/app/layout.tsx',
    size: '2.4 KB',
    lastModified: new Date('2024-01-15'),
    description: 'Layout principal de l\'application avec navigation'
  },
  {
    id: '2',
    name: 'page.tsx',
    type: 'page',
    path: '/app/page.tsx',
    size: '3.2 KB',
    lastModified: new Date('2024-01-15'),
    description: 'Page d\'accueil avec hero section et featured products'
  },
  {
    id: '3',
    name: 'ProductCard.tsx',
    type: 'component',
    path: '/components/ProductCard.tsx',
    size: '1.8 KB',
    lastModified: new Date('2024-01-14'),
    description: 'Composant carte produit avec image, prix et actions'
  },
  {
    id: '4',
    name: 'Navbar.tsx',
    type: 'component',
    path: '/components/Navbar.tsx',
    size: '2.1 KB',
    lastModified: new Date('2024-01-14'),
    description: 'Navigation principale avec menu et panier'
  },
  {
    id: '5',
    name: 'ShoppingCart.tsx',
    type: 'component',
    path: '/components/ShoppingCart.tsx',
    size: '3.5 KB',
    lastModified: new Date('2024-01-13'),
    description: 'Composant panier avec gestion des quantités'
  },
  {
    id: '6',
    name: 'checkout.tsx',
    type: 'page',
    path: '/app/checkout/page.tsx',
    size: '4.2 KB',
    lastModified: new Date('2024-01-13'),
    description: 'Page de checkout avec formulaire et paiement'
  },
  {
    id: '7',
    name: 'route.ts',
    type: 'api',
    path: '/app/api/products/route.ts',
    size: '1.5 KB',
    lastModified: new Date('2024-01-12'),
    description: 'API endpoint pour récupérer les produits'
  },
  {
    id: '8',
    name: 'route.ts',
    type: 'api',
    path: '/app/api/auth/route.ts',
    size: '2.3 KB',
    lastModified: new Date('2024-01-12'),
    description: 'API d\'authentification avec NextAuth.js'
  },
  {
    id: '9',
    name: 'globals.css',
    type: 'style',
    path: '/app/globals.css',
    size: '1.2 KB',
    lastModified: new Date('2024-01-11'),
    description: 'Styles globaux avec Tailwind CSS'
  },
  {
    id: '10',
    name: 'next.config.js',
    type: 'config',
    path: '/next.config.js',
    size: '0.8 KB',
    lastModified: new Date('2024-01-11'),
    description: 'Configuration Next.js avec optimisations'
  },
  {
    id: '11',
    name: 'prisma.schema',
    type: 'config',
    path: '/prisma/schema.prisma',
    size: '3.1 KB',
    lastModified: new Date('2024-01-10'),
    description: 'Schéma de base de données avec Prisma'
  },
  {
    id: '12',
    name: 'AuthProvider.tsx',
    type: 'component',
    path: '/components/AuthProvider.tsx',
    size: '1.9 KB',
    lastModified: new Date('2024-01-10'),
    description: 'Provider d\'authentification avec contexte'
  }
];

export const mockUIComponents: UIComponent[] = [
  {
    id: '1',
    name: 'Bouton Principal',
    type: 'button',
    preview: 'Bouton avec style moderne et animations',
    props: {
      variant: 'primary',
      size: 'medium',
      disabled: false,
      loading: false
    }
  },
  {
    id: '2',
    name: 'Formulaire de Contact',
    type: 'form',
    preview: 'Formulaire avec validation et messages d\'erreur',
    props: {
      fields: ['name', 'email', 'message'],
      validation: true,
      submitAction: 'handleSubmit'
    }
  },
  {
    id: '3',
    name: 'Carte Produit',
    type: 'card',
    preview: 'Carte avec image, titre, prix et actions',
    props: {
      image: '/product-image.jpg',
      title: 'Produit Exemple',
      price: 29.99,
      actions: ['add-to-cart', 'wishlist']
    }
  },
  {
    id: '4',
    name: 'Navigation Principale',
    type: 'navbar',
    preview: 'Navigation responsive avec menu mobile',
    props: {
      logo: '/logo.svg',
      links: ['Accueil', 'Produits', 'Contact'],
      userMenu: true,
      searchBar: true
    }
  }
];