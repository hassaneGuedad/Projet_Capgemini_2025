# 🧪 Guide des Tests Unitaires

Ce projet utilise **Vitest** pour les tests unitaires avec **React Testing Library** pour tester les composants React.

## 📦 Scripts disponibles

```bash
# Lancer les tests en mode watch (développement)
npm run test

# Lancer les tests avec interface graphique
npm run test:ui

# Lancer les tests une seule fois
npm run test:run

# Lancer les tests avec couverture de code
npm run test:coverage

# Lancer les tests pour CI/CD (Azure DevOps)
npm run test:ci
```

## 🏗️ Structure des tests

```
project/
├── src/
│   └── test/
│       └── setup.ts              # Configuration globale des tests
├── services/
│   └── __tests__/
│       └── authorized-emails.test.ts
├── components/
│   └── __tests__/
│       └── Navbar.test.tsx
├── hooks/
│   └── __tests__/
│       └── useAuth.test.ts
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── vitest.config.ts              # Configuration Vitest
```

## 🎯 Types de tests

### 1. Tests de Services
Testez la logique métier et les appels API :

```typescript
import { describe, it, expect, vi } from 'vitest'
import { addAuthorizedEmail } from '../authorized-emails'

describe('Authorized Emails Service', () => {
  it('should add an email to authorized list', async () => {
    // Arrange
    const email = 'test@example.com'
    
    // Act
    const result = await addAuthorizedEmail(email)
    
    // Assert
    expect(result).toBe(true)
  })
})
```

### 2. Tests de Composants
Testez le rendu et les interactions utilisateur :

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar Component', () => {
  it('should render navigation links', () => {
    render(<Navbar />)
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/guide/i)).toBeInTheDocument()
  })
  
  it('should handle user interactions', () => {
    render(<Navbar />)
    
    const button = screen.getByText(/sign in/i)
    fireEvent.click(button)
    
    // Vérifier que l'action a été déclenchée
  })
})
```

### 3. Tests de Hooks
Testez la logique des hooks personnalisés :

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

describe('useAuth Hook', () => {
  it('should return user state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
```

## 🔧 Configuration

### Vitest Config (`vitest.config.ts`)
- **Environment** : jsdom pour les tests React
- **Coverage** : Seuils de 70% pour branches, fonctions, lignes et statements
- **Reporters** : verbose, junit, html, lcov, cobertura
- **Aliases** : Support des imports avec `@/`

### Setup Global (`src/test/setup.ts`)
- Configuration de `@testing-library/jest-dom`
- Mocks pour Next.js, Firebase, Monaco Editor
- Configuration des APIs globales (ResizeObserver, matchMedia)

## 📊 Couverture de Code

La couverture de code est configurée avec des seuils minimaux :

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

### Générer un rapport de couverture

```bash
npm run test:coverage
```

Le rapport sera disponible dans le dossier `coverage/`.

## 🚀 Intégration Azure DevOps

Le pipeline CI/CD est configuré dans `azure-pipelines.yml` :

### Étapes du pipeline :
1. **Installation** des dépendances
2. **Linting** avec ESLint
3. **Tests unitaires** avec couverture
4. **Publication** des résultats de tests
5. **Publication** du rapport de couverture
6. **Build** de l'application
7. **Déploiement** (si sur la branche main)

### Déclenchement automatique :
- Sur les pushes vers `main`, `develop`, `feature/*`
- Sur les Pull Requests vers `main`, `develop`

## 🎨 Bonnes pratiques

### 1. Nommage des tests
```typescript
describe('ComponentName', () => {
  it('should do something when condition', () => {
    // test
  })
})
```

### 2. Structure AAA (Arrange, Act, Assert)
```typescript
it('should add item to list', () => {
  // Arrange
  const item = { id: 1, name: 'Test' }
  
  // Act
  const result = addItem(item)
  
  // Assert
  expect(result).toContain(item)
})
```

### 3. Tests isolés
- Chaque test doit être indépendant
- Utilisez `beforeEach` pour réinitialiser l'état
- Évitez les dépendances entre tests

### 4. Mocks appropriés
```typescript
// Mock des dépendances externes
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  // ...
}))
```

## 🔍 Debugging des tests

### Mode watch avec UI
```bash
npm run test:ui
```

### Tests spécifiques
```bash
npm run test -- Navbar
npm run test -- --grep "should render"
```

### Variables d'environnement
```bash
DEBUG=true npm run test
```

## 📈 Métriques et rapports

### Azure DevOps
- **Résultats de tests** : Historique des succès/échecs
- **Couverture de code** : Tendances et seuils
- **Temps d'exécution** : Optimisation des performances

### Rapports locaux
- **HTML** : `coverage/index.html`
- **JSON** : `coverage/coverage-final.json`
- **LCOV** : `coverage/lcov.info`

## 🚨 Troubleshooting

### Erreurs communes

1. **Module not found**
   ```bash
   # Vérifier les alias dans vitest.config.ts
   # Vérifier les imports dans les tests
   ```

2. **Firebase mocks**
   ```typescript
   // S'assurer que les mocks Firebase sont corrects
   vi.mock('firebase/firestore', () => ({
     // mocks appropriés
   }))
   ```

3. **Tests React**
   ```typescript
   // Utiliser render() de @testing-library/react
   // Vérifier les data-testid pour les sélecteurs
   ```

### Support
Pour toute question sur les tests, consultez :
- [Documentation Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM](https://github.com/testing-library/jest-dom) 