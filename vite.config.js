import { defineConfig } from 'vite'

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

  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
