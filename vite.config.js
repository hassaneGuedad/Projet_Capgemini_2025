import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // Configuration du serveur dev et optimisation des dépendances
  server: {
    deps: {
      inline: ['nodemailer'],  // Forcer l'inclusion en inline dans le serveur dev
      external: []             // Liste si besoin de packages à exclure
    }
  },

  optimizeDeps: {
    include: ['nodemailer'],  // Forcer l'optimisation de ce package en build dev
    exclude: []
  },

  ssr: {
    noExternal: ['nodemailer']  // Empêche nodemailer d'être externalisé en SSR (test, build)
  },

  // Configuration des alias de chemins pour Vitest
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },

  test: {
    globals: true,
    environment: 'jsdom', // Changé de 'node' à 'jsdom' pour les tests React
    setupFiles: ['./src/test/setup.tsx'], // Fichier de configuration des tests
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
