'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import AuthDialog from "@/components/AuthDialog";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Écoute l'état d'authentification Firebase
    if (!auth) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      console.log('[FIRESTORE] Auth state changed:', firebaseUser ? 'User connected' : 'No user');
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || '')}`
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      console.log('[FIRESTORE] Cleaning up auth state listener');
      unsubscribe();
    };
  }, [auth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    if (!auth) {
      setIsLoading(false);
      throw new Error("Firebase Auth n'est pas initialisé.");
    }
    await signInWithEmailAndPassword(auth, email, password);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    if (!auth) {
      setIsLoading(false);
      throw new Error("Firebase Auth n'est pas initialisé.");
    }
    await signOut(auth);
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};