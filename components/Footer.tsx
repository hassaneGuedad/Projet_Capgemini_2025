import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full bg-gray-100 border-t mt-12">
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
      {/* Left: Capgemini & Brands */}
      <div>
        <img src="/img/Capgemini_Logo.png" alt="Capgemini" className="h-16 mb-2" />
        <div className="mb-2 font-bold text-lg">Our brands:</div>
        <div className="flex flex-col items-start space-y-2">
        <br /><a href="https://www.capgemini-engineering.com/" target="_blank" rel="noopener noreferrer">
            <img src="/img/Logo_Capgemini_Engineering.svg" alt="Capgemini Engineering" className="h-8" />
          </a>
          <br /> <a href="https://www.capgemini.com/service/invent/" target="_blank" rel="noopener noreferrer">
            <img src="/img/Logo_Capgemini_Invent.svg" alt="Capgemini Invent" className="h-8" />
          </a>
          <br /> <a href="https://www.sogeti.com/" target="_blank" rel="noopener noreferrer">
            <img src="/img/Logo_Sogeti.svg" alt="Sogeti" className="h-8" />
          </a>
          <br /><a href="https://www.frog.co/" target="_blank" rel="noopener noreferrer">
            <img src="/img/Logo_Frog-Design.svg" alt="Frog" className="h-8" />
          </a>
        </div>
      </div>
      {/* Center: Main links */}
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="flex flex-col items-start space-y-2">
        <br /><br /><br /><br /><br /><br /> <a href="#" className="hover:underline"> sights</a>
          <a href="#" className="hover:underline">Industries</a>
          <a href="#" className="hover:underline">Services</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">News</a>
          <a href="#" className="hover:underline">About us</a>
          <a href="#" className="hover:underline">Contact us</a>
          <a href="#" className="hover:underline">Investors</a>
        </div>
      </div>
      {/* Right: Legal & Accessibility */}
      <div className="flex flex-col items-end md:items-end">
        <div className="flex flex-col items-start space-y-2">
        <br /><br /><br /><br /><br /><br /><a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Cookie policy</a>
          <a href="#" className="hover:underline">Cookie settings</a>
          <a href="#" className="hover:underline">Privacy notice</a>
          <a href="#" className="hover:underline">Security vulnerability notification</a>
          <a href="#" className="hover:underline">SpeakUp</a>
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Fraud alert</a>
        </div>
      </div>
    </div>

    {/* Ligne horizontale partielle au centre */}
    <div className="w-full flex justify-center my-4">
      <div className="w-1/2 border-t border-gray-300"></div>
    </div>

    {/* Bas du footer : Réseaux sociaux à gauche, copyright à droite */}
    <div className="w-full flex items-center justify-between mt-4">
      {/* Copyright à gauche */}
      <div className="text-sm text-gray-500">© Capgemini, 2025. All rights reserved.</div>
      {/* Réseaux sociaux à droite */}
      <div className="flex items-center space-x-4">
        <a href="https://www.linkedin.com/company/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path d="M6.94 7.5C7.8 7.5 8.5 6.8 8.5 5.94C8.5 5.08 7.8 4.38 6.94 4.38C6.08 4.38 5.38 5.08 5.38 5.94C5.38 6.8 6.08 7.5 6.94 7.5ZM7.98 9.25H5.9V19H7.98V9.25ZM12.5 9.25H10.5V19H12.5V14.25C12.5 12.5 14.5 12.5 14.5 14.25V19H16.5V13.5C16.5 10.5 13.5 10.75 12.5 12.25V9.25Z" fill="white"/></svg>
        </a>
        <a href="https://www.instagram.com/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <img src="/img/instagram-1-svgrepo-com.svg" alt="Instagram" className="h-6 w-6" />
        </a>
        <a href="https://www.facebook.com/capgemini/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1877F3"/><path d="M15.117 8.667h-1.184c-.144 0-.283.144-.283.288v1.14h1.467l-.192 1.5h-1.275V19h-1.5v-7.405h-1.125v-1.5h1.125v-1.08c0-1.08.66-1.665 1.665-1.665h1.08v1.5z" fill="white"/></svg>
        </a>
        <a href="https://www.youtube.com/user/capgeminivideo" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF0000"/><polygon points="10,8 16,12 10,16" fill="white"/></svg>
        </a>
      </div>
    </div>
    {/* Retour de ligne vide pour aération */}
    <div className="h-6" />
  </footer>
);

export default Footer; 