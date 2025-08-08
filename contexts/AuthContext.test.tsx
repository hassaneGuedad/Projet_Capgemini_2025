import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import React from 'react';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

// Mock client Firebase
vi.mock('@/lib/firebase-client', () => ({
  auth: {},
}));

// Composant de test
const TestAuthComponent = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <span>Utilisateur: {user ? user.name : 'Aucun'}</span>
      <span>Authentifié: {isAuthenticated.toString()}</span>
    </div>
  );
};

describe('AuthProvider', () => {
    const mockUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'http://example.com/avatar.png',
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait afficher l'état de chargement initialement", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it("devrait afficher les informations de l'utilisateur après connexion", async () => {
        let authStateCallback: (user: User | null) => void = () => {};
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      authStateCallback = callback as (user: User | null) => void;
      return () => {};
    });

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    act(() => {
      authStateCallback(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByText('Utilisateur: Test User')).toBeInTheDocument();
    });
    expect(screen.getByText('Authentifié: true')).toBeInTheDocument();
  });

  it("devrait gérer la déconnexion de l'utilisateur", async () => {
        let authStateCallback: (user: User | null) => void = () => {};

    // On capture le callback pour le contrôler manuellement
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      authStateCallback = callback as (user: User | null) => void;
      return () => {}; // Fonction de nettoyage (unsubscribe)
    });

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    // 1. Simuler la connexion
    act(() => {
      authStateCallback(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByText('Utilisateur: Test User')).toBeInTheDocument();
    });

    // 2. Simuler la déconnexion
    act(() => {
      authStateCallback(null);
    });

    await waitFor(() => {
      expect(screen.getByText('Utilisateur: Aucun')).toBeInTheDocument();
    });
    expect(screen.getByText('Authentifié: false')).toBeInTheDocument();
  });
});
