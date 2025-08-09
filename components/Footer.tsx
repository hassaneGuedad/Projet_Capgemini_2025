import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full border-t mt-12 bg-gradient-to-b from-gray-50 to-white relative">
    {/* Décor subtil en arrière-plan */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.08),transparent_45%)]" />

    <div className="relative max-w-7xl mx-auto px-4 py-10 text-sm text-gray-700">
      {/* Bandeau CTA newsletter */}
      <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Restez informé</h3>
          <p className="text-xs md:text-sm text-gray-500">Recevez les nouveautés produits et les guides d'utilisation</p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <input
              type="email"
              placeholder="Votre email (bientôt disponible)"
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white/70"
              aria-label="Saisissez votre adresse e-mail"
            />
          </div>
          <button
            type="button"
            aria-disabled
            className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm shadow hover:bg-blue-700 disabled:opacity-60"
            disabled
            title="Fonction bientôt disponible"
          >
            S'abonner
          </button>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
        {/* Colonne marque et filiales */}
        <div>
          <img src="/img/Capgemini_Logo.png" alt="Capgemini" className="h-14 mb-3 opacity-90 hover:opacity-100 transition" />
          <div className="mb-2 font-semibold text-gray-900">Nos marques</div>
          <div className="flex flex-col items-start space-y-2">
            <a href="https://www.capgemini-engineering.com/" target="_blank" rel="noopener noreferrer">
              <img src="/img/Logo_Capgemini_Engineering.svg" alt="Capgemini Engineering" className="h-8 opacity-80 hover:opacity-100 transition duration-200" />
            </a>
            <a href="https://www.capgemini.com/service/invent/" target="_blank" rel="noopener noreferrer">
              <img src="/img/Logo_Capgemini_Invent.svg" alt="Capgemini Invent" className="h-8 opacity-80 hover:opacity-100 transition duration-200" />
            </a>
            <a href="https://www.sogeti.com/" target="_blank" rel="noopener noreferrer">
              <img src="/img/Logo_Sogeti.svg" alt="Sogeti" className="h-8 opacity-80 hover:opacity-100 transition duration-200" />
            </a>
            <a href="https://www.frog.co/" target="_blank" rel="noopener noreferrer">
              <img src="/img/Logo_Frog-Design.svg" alt="Frog" className="h-8 opacity-80 hover:opacity-100 transition duration-200" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-start">
          <div className="font-semibold text-gray-900 mb-2">Navigation</div>
          <div className="flex flex-col items-start space-y-2">
            <a href="/" className="hover:text-blue-600 transition">Accueil</a>
            <a href="/dashboard" className="hover:text-blue-600 transition">Dashboard</a>
            <a href="/guide" className="hover:text-blue-600 transition">Guide d’utilisation</a>
            <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>

        {/* Légal & Accessibilité (aligné à droite sur desktop) */}
        <div className="flex flex-col items-start md:items-end">
          <div className="font-semibold text-gray-900 mb-2">Légal & Accessibilité</div>
          <div className="flex flex-col items-start md:items-end space-y-2 text-left md:text-right">
            <a href="https://www.capgemini.com/accessibility/" className="hover:text-blue-600 transition">Accessibility</a>
            <a href="https://www.capgemini.com/cookie-policy/" className="hover:text-blue-600 transition">Cookie policy</a>
            <a href="https://www.capgemini.com/cookie-policy/#" className="hover:text-blue-600 transition">Cookie settings</a>
            <a href="https://www.capgemini.com/privacy-notice/" className="hover:text-blue-600 transition">Privacy notice</a>
            <a href="https://www.capgemini.com/security-vulnerability-notification/" className="hover:text-blue-600 transition">Security vulnerability notification</a>
            <a href="#" className="hover:text-blue-600 transition">SpeakUp</a>
            <a href="https://www.capgemini.com/terms-of-use/" className="hover:text-blue-600 transition">Terms of use</a>
            <a href="https://www.capgemini.com/fraud-alert/" className="hover:text-blue-600 transition">Fraud alert</a>
          </div>
        </div>

        {/* Contact / Ressources */}
        <div className="flex flex-col items-start">
          <div className="font-semibold text-gray-900 mb-2">Ressources</div>
          <div className="flex flex-col items-start space-y-2">
            <a href="/guide" className="hover:text-blue-600 transition">Guide de démarrage</a>
            <a href="/contact" className="hover:text-blue-600 transition">Support & Contact</a>
            <a href="#" className="hover:text-blue-600 transition">Centre d’aide</a>
          </div>
        </div>
      </div>

      {/* Séparateur central */}
      <div className="w-full flex justify-center my-6">
        <div className="w-1/2 border-t border-gray-200"></div>
      </div>

      {/* Bas du footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Réseaux sociaux */}
        <div className="flex items-center space-x-3 order-1 md:order-1">
          <a href="https://www.linkedin.com/company/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-gray-200 hover:ring-blue-300 transition">
            <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path d="M6.94 7.5C7.8 7.5 8.5 6.8 8.5 5.94C8.5 5.08 7.8 4.38 6.94 4.38C6.08 4.38 5.38 5.08 5.38 5.94C5.38 6.8 6.08 7.5 6.94 7.5ZM7.98 9.25H5.9V19H7.98V9.25ZM12.5 9.25H10.5V19H12.5V14.25C12.5 12.5 14.5 12.5 14.5 14.25V19H16.5V13.5C16.5 10.5 13.5 10.75 12.5 12.25V9.25Z" fill="white"/></svg>
          </a>
          <a href="https://www.instagram.com/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-gray-200 hover:ring-blue-300 transition">
            <img src="/img/instagram-1-svgrepo-com.svg" alt="Instagram" className="h-6 w-6" />
          </a>
          <a href="https://www.facebook.com/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-gray-200 hover:ring-blue-300 transition">
            <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1877F3"/><path d="M15.117 8.667h-1.184c-.144 0-.283.144-.283.288v1.14h1.467l-.192 1.5h-1.275V19h-1.5v-7.405h-1.125v-1.5h1.125v-1.08c0-1.08.66-1.665 1.665-1.665h1.08v1.5z" fill="white"/></svg>
          </a>
          <a href="https://www.youtube.com/user/capgeminivideo" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-gray-200 hover:ring-blue-300 transition">
            <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF0000"/><polygon points="10,8 16,12 10,16" fill="white"/></svg>
          </a>
        </div>

        {/* Copyright + Back to top */}
        <div className="flex items-center gap-3 order-2 md:order-2 text-gray-600">
          <span className="text-center md:text-left tracking-tight">© Capgemini, 2025. All rights reserved.</span>
          <span className="hidden md:inline-block h-4 w-px bg-gray-300" aria-hidden="true" />
          <a href="#" className="text-gray-600 hover:text-blue-700 text-xs md:text-sm">Retour en haut</a>
        </div>
      </div>
    </div>

    {/* Espace inférieur pour aération */}
    <div className="h-6" />
  </footer>
);

export default Footer;
