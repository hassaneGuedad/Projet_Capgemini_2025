import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // permet d'utiliser les globals comme describe, it, expect sans import
    environment: 'jsdom',   // simule un navigateur pour les tests React
    coverage: {
      provider: 'v8',       // coverage avec V8 (rapide et simple)
      reporter: ['text', 'json', 'html'], // formats de rapport de couverture
      all: true,            // mesurer la couverture de tous les fichiers, même non testés
      include: ['src/**/*.{js,jsx,ts,tsx}'], // dossiers/fichiers à inclure
      exclude: ['node_modules/', 'test/'],   // dossiers à exclure
    },
    maxThreads: 1,          // option pour la CI (évite certains problèmes)
  },
})
