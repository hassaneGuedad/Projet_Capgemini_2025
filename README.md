# 🚀 Cap WorkSpace

Une plateforme intelligente de génération automatique de projets web alimentée par l'IA, développée par Capgemini .

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies](#️-technologies)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📖 Utilisation](#-utilisation)
- [🔧 Développement](#-développement)
- [📊 Diagrammes UML](#-diagrammes-uml)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## 🎯 Vue d'ensemble

**Cap WorkSpace** est une plateforme révolutionnaire qui automatise la création de projets web complets en utilisant l'intelligence artificielle. Elle transforme une simple description textuelle en un projet fonctionnel avec architecture, code source, documentation et déploiement automatique.

### 🎪 Démonstration

- **Génération automatique** de projets web complets
- **Éditeur de code intégré** avec syntax highlighting
- **Générateur UML automatique** pour la documentation technique
- **Chatbot IA** pour l'assistance et les modifications
- **Déploiement automatique** vers GitHub et Netlify
- **Authentification sécurisée** avec contrôle d'accès

## ✨ Fonctionnalités

### 🤖 **Génération IA Intelligente**
- **PromptAgent** : Analyse et structure les demandes utilisateur
- **PlannerAgent** : Crée l'architecture du projet
- **CodeAgent** : Génère le code source optimisé
- **ValidatorAgent** : Valide la qualité et la syntaxe du code
- **DeployAgent** : Gère le déploiement automatique

### 🎨 **Interface Utilisateur Avancée**
- **Dashboard interactif** avec gestion de projets
- **Éditeur Monaco** intégré pour l'édition en temps réel
- **Générateur UML** avec 5 types de diagrammes
- **Chatbot IA** pour l'assistance continue
- **Système d'onglets** pour l'édition multi-fichiers

### 🔐 **Sécurité et Authentification**
- **Authentification Google Firebase**
- **Contrôle d'accès par email autorisé**
- **Gestion administrative des utilisateurs**
- **Sauvegarde sécurisée** dans Firestore

### 📊 **Analyse et Documentation**
- **Génération automatique UML** :
  - Diagrammes de classes
  - Diagrammes de composants
  - Diagrammes de séquence
  - Diagrammes d'activité
  - Diagrammes entité-relation
- **Statistiques de projet**
- **Documentation technique automatique**

### 🚀 **Déploiement et Export**
- **Export ZIP** des projets
- **Déploiement GitHub** automatique
- **Déploiement Netlify** en un clic
- **URL de production** générée automatiquement

## 🏗️ Architecture

### 📦 **Structure du Projet**

```
project/
├── app/                    # Pages Next.js 13+ (App Router)
│   ├── api/               # API Routes
│   ├── dashboard/         # Interface principale
│   ├── contact/           # Page de contact
│   └── guide/             # Documentation utilisateur
├── components/            # Composants React
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── workbench/        # Éditeur de code
│   └── ...               # Composants métier
├── agents/               # Agents IA spécialisés
├── services/             # Services backend
├── lib/                  # Utilitaires et configurations
├── types/                # Définitions TypeScript
└── public/               # Assets statiques
```

### 🔄 **Flux de Données**

1. **Saisie utilisateur** → Prompt de projet
2. **Analyse IA** → PromptAgent structure la demande
3. **Planification** → PlannerAgent crée l'architecture
4. **Génération** → CodeAgent génère le code
5. **Validation** → ValidatorAgent vérifie la qualité
6. **Édition** → Interface utilisateur pour modifications
7. **Déploiement** → DeployAgent publie le projet

## 🛠️ Technologies

### **Frontend**
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **shadcn/ui** - Composants UI modernes
- **Monaco Editor** - Éditeur de code intégré
- **Mermaid.js** - Génération de diagrammes

### **Backend**
- **Firebase** - Authentification et base de données
- **Firestore** - Base de données NoSQL
- **Next.js API Routes** - API backend

### **IA et Services**
- **Anthropic Claude** - Modèle de langage principal
- **DeepSeek** - Génération de code
- **GitHub API** - Gestion des repositories
- **Netlify API** - Déploiement automatique

### **Outils de Développement**
- **ESLint** - Linting du code
- **Prettier** - Formatage automatique
- **Husky** - Git hooks
- **TypeScript** - Compilation et vérification

## 🚀 Installation

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Compte Google (pour l'authentification)
- Clé API Anthropic Claude

### **Étapes d'installation**

1. **Cloner le repository**
```bash
git clone <repository-url>
cd capgemini-projet-nextjs/project
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir l'application**
```
http://localhost:3000
```

## ⚙️ Configuration

### **Variables d'Environnement**

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Anthropic Claude API Key (OBLIGATOIRE)
CLAUDE_API_KEY=your_claude_api_key

# Netlify Configuration (optionnel)
NETLIFY_ACCESS_TOKEN=your_netlify_token

# GitHub Configuration (optionnel)
GITHUB_TOKEN=your_github_token
```

### **Obtention des Clés API**

1. **Claude API Key** : [console.anthropic.com](https://console.anthropic.com)
2. **Firebase** : [console.firebase.google.com](https://console.firebase.google.com)
3. **Netlify** : [app.netlify.com](https://app.netlify.com)
4. **GitHub** : [github.com/settings/tokens](https://github.com/settings/tokens)

## 📖 Utilisation

### **1. Création d'un Projet**

1. **Accédez au dashboard** après authentification
2. **Décrivez votre projet** dans le formulaire de prompt
3. **Vérifiez les technologies** détectées automatiquement
4. **Soumettez le prompt** pour génération
5. **Validez le plan** généré par l'IA
6. **Attendez la génération** complète du projet

### **2. Édition et Amélioration**

1. **Ouvrez les fichiers** dans l'éditeur intégré
2. **Modifiez le code** en temps réel
3. **Sauvegardez automatiquement** vos modifications
4. **Prévisualisez** les changements

### **3. Assistance IA**

1. **Ouvrez le chatbot** via le bouton flottant
2. **Posez vos questions** en langage naturel
3. **Demandez des modifications** de code
4. **Obtenez des explications** sur le fonctionnement

### **4. Génération UML**

1. **Cliquez sur le bouton UML** flottant
2. **Sélectionnez le type** de diagramme
3. **Générez automatiquement** les diagrammes
4. **Téléchargez** en format Mermaid ou SVG

### **5. Déploiement**

1. **Sauvegardez** votre projet
2. **Cliquez sur déployer** pour GitHub/Netlify
3. **Obtenez l'URL** de production automatiquement

## 🔧 Développement

### **Scripts Disponibles**

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript

# Tests
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end

# Utilitaires
npm run format       # Formatage Prettier
npm run clean        # Nettoyage des builds
```

### **Structure des Agents IA**

```typescript
// PromptAgent - Analyse des prompts utilisateur
export async function PromptAgent(prompt: string): Promise<Plan>

// PlannerAgent - Création de l'architecture
export async function PlannerAgent(plan: Plan): Promise<FilePlan[]>

// CodeAgent - Génération de code
export async function CodeAgent(filePlan: FilePlan): Promise<GeneratedFile>

// ValidatorAgent - Validation du code
export async function ValidatorAgent(file: GeneratedFile): Promise<boolean>

// DeployAgent - Déploiement automatique
export async function DeployAgent(project: Project): Promise<DeploymentResult>
```

### **Ajout de Nouveaux Agents**

1. **Créez le fichier** dans `agents/`
2. **Implémentez l'interface** standard
3. **Ajoutez les tests** unitaires
4. **Intégrez** dans le workflow principal

## 📊 Diagrammes UML

Le projet inclut une documentation UML complète :

- **Diagramme de Cas d'Utilisation** : Interactions utilisateur
- **Diagramme de Classes** : Architecture du système
- **Diagramme de Séquence** : Flux d'authentification
- **Diagramme d'Activité** : Workflow complet

### **Génération Automatique**

Le système génère automatiquement :
- **Diagrammes de classes** à partir du code
- **Diagrammes de composants** pour l'architecture
- **Diagrammes de séquence** pour les interactions
- **Diagrammes d'activité** pour les workflows
- **Diagrammes entité-relation** pour la base de données

## 🤝 Contribution

### **Guidelines de Contribution**

1. **Fork** le repository
2. **Créez une branche** pour votre fonctionnalité
3. **Commitez** vos changements
4. **Poussez** vers la branche
5. **Ouvrez une Pull Request**

### **Standards de Code**

- **TypeScript strict** pour tout le code
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Tests unitaires** pour les nouvelles fonctionnalités
- **Documentation** pour les APIs publiques

### **Architecture des Composants**

```typescript
// Structure recommandée pour les composants
interface ComponentProps {
  // Props typées
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Logique du composant
  return (
    // JSX avec Tailwind CSS
  );
}
```

## 📄 Licence

Ce projet est développé par **Capgemini Engineering** et est propriétaire.

### **Utilisation Interne**

- Réservé aux employés Capgemini autorisés
- Contrôle d'accès par email administrateur
- Utilisation conforme aux politiques internes

### **Support**

Pour toute question ou problème :
- **Email** : scapworkSpace@gmail.com
- **Documentation** : Consultez le guide intégré
- **Issues** : Utilisez le système de tickets GitHub

---

**Développé avec ❤️ par l'équipe Capgemini **

*Une plateforme intelligente pour l'avenir du développement web* 
