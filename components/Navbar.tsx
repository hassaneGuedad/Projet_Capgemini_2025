'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2, Home, LayoutDashboard, LogOut, User, Loader2, Menu } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");
    try {
      if (isLoginMode) {
        await login(loginForm.email, loginForm.password);
      } else {
        if (!auth) {
          setAuthError("Firebase Auth n'est pas initialisé.");
          setIsSubmitting(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      }
      setIsLoginOpen(false);
      setLoginForm({ email: '', password: '' });
      setIsLoginMode(true);
    } catch (error: any) {
      setAuthError(error.message || "Erreur d'authentification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleGoogleSignIn = async () => {
    console.log('🔍 === DÉBUT GOOGLE SIGN-IN ===');
    console.log('🔍 Timestamp:', new Date().toISOString());
    
    setIsSubmitting(true);
    setAuthError("");
    try {
      if (!auth) {
        console.log('❌ Firebase Auth non initialisé');
        setAuthError("Firebase Auth n'est pas initialisé.");
        setIsSubmitting(false);
        return;
      }
      
      console.log('🔍 Création du provider Google...');
      const provider = new GoogleAuthProvider();
      console.log('🔍 Tentative de connexion Google...');
      
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Connexion Google Firebase réussie');
      console.log('🔍 Email Google:', result.user.email);
      
      // Vérifier si l'email Google est autorisé
      if (result.user.email) {
        console.log('🔍 === VÉRIFICATION EMAIL GOOGLE ===');
        console.log('🔍 Email à vérifier:', result.user.email);
        
        console.log('🔍 Appel API /api/auth/check-email...');
        const checkResponse = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: result.user.email })
        });

        console.log('🔍 Status de la réponse:', checkResponse.status);
        const checkData = await checkResponse.json();
        console.log('🔍 Données de la réponse:', checkData);

        if (!checkResponse.ok) {
          console.log('❌ === ERREUR VÉRIFICATION GOOGLE ===');
          console.log('❌ Erreur API:', checkData.error);
          // Déconnecter l'utilisateur si erreur de vérification
          await signOut(auth);
          setAuthError(checkData.error || 'Erreur lors de la vérification de l\'email');
          setIsSubmitting(false);
          return;
        }

        if (!checkData.isAuthorized) {
          console.log('❌ === EMAIL GOOGLE NON AUTORISÉ ===');
          console.log('❌ Email rejeté:', result.user.email);
          console.log('❌ Déconnexion forcée...');
          // Déconnecter l'utilisateur si email non autorisé
          await signOut(auth);
          setAuthError('❌ Cet email Google n\'est pas autorisé à accéder à la plateforme. Seuls les emails ajoutés par l\'administrateur peuvent se connecter. Veuillez contacter l\'administrateur (scapworkspace@gmail.com).');
          setIsSubmitting(false);
          return;
        }
        
        console.log('✅ === EMAIL GOOGLE AUTORISÉ ===');
        console.log('✅ Email accepté:', result.user.email);
        console.log('✅ Connexion Google réussie');
      }
      
      console.log('🔍 === FINALISATION ===');
      // On peut ici stocker l'utilisateur dans le contexte si besoin 
      setIsLoginOpen(false);
      setIsLoginMode(true);
      console.log('✅ === GOOGLE SIGN-IN TERMINÉ AVEC SUCCÈS ===');
    } catch (error: any) {
      console.error('❌ === ERREUR GOOGLE SIGN-IN ===');
      console.error('❌ Erreur Firebase:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      setAuthError(error.message || "Erreur Google Sign-In");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/img/Capgemini_Logo.png"
              alt="Logo Capgemini"
              className="h-16 w-16 object-contain rounded-full shadow"
            />
            <span className="text-2xl font-bold" style={{ fontFamily: 'Luckiest Guy, cursive' }}>
              <span className="text-blue-600">Cap</span><span className="text-yellow-400">WorkSpace</span>
            </span>
          </Link>

          {/* Hamburger menu (mobile) */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <Menu className="h-8 w-8 text-blue-600" />
          </button>

          {/* Navigation Links (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link 
              href="/guide" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Code2 className="h-4 w-4" />
              <span>Guide d’utilisation</span>
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Se connecter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{isLoginMode ? "Se connecter" : "Créer un compte"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAuth} className="space-y-4">
                    {authError && <div className="text-red-500 text-sm">{authError}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isLoginMode ? "Connexion..." : "Inscription..."}
                        </>
                      ) : (
                        isLoginMode ? 'Se connecter' : "S&apos;inscrire"
                      )}
                    </Button>
                  </form>
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full mt-2 bg-white border text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.11-10.34 7.11-17.676z" fill="#4285F4"/><path d="M24.48 48c6.48 0 11.94-2.14 15.92-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.18 2.3-6.28 0-11.6-4.24-13.5-9.96H2.6v6.24C6.56 43.34 14.8 48 24.48 48z" fill="#34A853"/><path d="M10.98 28.46c-.5-1.44-.8-2.98-.8-4.56 0-1.58.3-3.12.8-4.56v-6.24H2.6A23.97 23.97 0 000 24c0 3.98.96 7.76 2.6 11.04l8.38-6.58z" fill="#FBBC05"/><path d="M24.48 9.52c3.52 0 6.64 1.22 9.12 3.62l6.82-6.82C36.42 2.14 30.96 0 24.48 0 14.8 0 6.56 4.66 2.6 12.22l8.38 6.24c1.9-5.72 7.22-9.96 13.5-9.96z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>
                    Se connecter avec Google
                  </Button>
                  <div className="text-center mt-2">
                    {isLoginMode ? (
                      <span>
                        Pas de compte ?{' '}
                        <button type="button" className="text-blue-600 underline" onClick={() => setIsLoginMode(false)}>
                          S&apos;inscrire
                        </button>
                      </span>
                    ) : (
                      <span>
                        Déjà un compte ?{' '}
                        <button type="button" className="text-blue-600 underline" onClick={() => setIsLoginMode(true)}>
                          Se connecter
                        </button>
                      </span>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        {/* Mobile menu (dropdown) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 w-full animate-fade-in-down">
            <div className="flex flex-col py-4 space-y-2">
              <Link 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link 
                href="/guide" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Code2 className="h-4 w-4" />
                <span>Guide d’utilisation</span>
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};