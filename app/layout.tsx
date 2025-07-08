import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CapCode - Créez des projets web avec l\'IA',
  description: 'Plateforme de génération de projets web utilisant l\'intelligence artificielle pour créer des applications complètes et optimisées.',
  keywords: 'AI, développement web, génération de code, Next.js, React, intelligence artificielle',
  authors: [{ name: 'CapCode Team' }],
  openGraph: {
    title: 'CapCode - Créez des projets web avec l\'IA',
    description: 'Transformez vos idées en applications web complètes grâce à l\'intelligence artificielle.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link rel="icon" href="/img/mini_cap_logo-removebg-preview.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}