import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'node',           // Exécuter les tests dans un environnement Node.js
    deps: {
      external: ['nodemailer'],    // Ne pas transformer nodemailer (module Node)
      inline: []                   // Autres dépendances à bundler (laisse vide si pas besoin)
    },
    coverage: {
      provider: 'v8',              // Utilise le provider v8 pour coverage (rapide et simple)
      reporter: ['text', 'json', 'html'], // Rapports de couverture
    },
    reporters: ['verbose', 'junit'], // Reporters pour vitest
  },
})
