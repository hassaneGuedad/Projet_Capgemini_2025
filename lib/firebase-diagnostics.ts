import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface FirebaseDiagnostics {
  isConnected: boolean;
  isAuthenticated: boolean;
  authError?: string;
  firestoreError?: string;
  projectId: string;
  authDomain: string;
}

export async function runFirebaseDiagnostics(): Promise<FirebaseDiagnostics> {
  const diagnostics: FirebaseDiagnostics = {
    isConnected: false,
    isAuthenticated: false,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'capgeminismartprojectbuilder',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'capgeminismartprojectbuilder.firebaseapp.com'
  };

  try {
    // Check authentication
    if (!auth) {
      diagnostics.isAuthenticated = false;
      diagnostics.authError = "Firebase Auth n'est pas initialisé.";
    } else {
      const user = auth.currentUser;
      diagnostics.isAuthenticated = !!user;
      if (!user) {
        diagnostics.authError = 'No authenticated user found';
      }
    }

    // Check Firestore connection
    if (!db) {
      diagnostics.isConnected = false;
      diagnostics.firestoreError = "Firebase Firestore n'est pas initialisé.";
    } else {
      try {
        const testDoc = doc(db, '_test', 'connection');
        await getDoc(testDoc);
        diagnostics.isConnected = true;
      } catch (error: any) {
        diagnostics.isConnected = false;
        diagnostics.firestoreError = error.message;
        if (error.code === 'permission-denied') {
          diagnostics.firestoreError = 'Permission denied - check Firestore rules';
        } else if (error.code === 'unavailable') {
          diagnostics.firestoreError = 'Firestore temporarily unavailable';
        } else if (error.code === 'resource-exhausted') {
          diagnostics.firestoreError = 'Firestore quota exceeded';
        }
      }
    }

  } catch (error: any) {
    diagnostics.authError = error.message;
  }

  return diagnostics;
}

export function logFirebaseDiagnostics() {
  runFirebaseDiagnostics().then(diagnostics => {
    console.group('Firebase Diagnostics');
    console.log('Project ID:', diagnostics.projectId);
    console.log('Auth Domain:', diagnostics.authDomain);
    console.log('Is Authenticated:', diagnostics.isAuthenticated);
    console.log('Is Connected:', diagnostics.isConnected);
    
    if (diagnostics.authError) {
      console.error('Auth Error:', diagnostics.authError);
    }
    
    if (diagnostics.firestoreError) {
      console.error('Firestore Error:', diagnostics.firestoreError);
    }
    
    console.groupEnd();
  });
}

// Auto-run diagnostics in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Run diagnostics after a short delay to allow Firebase to initialize
  setTimeout(() => {
    logFirebaseDiagnostics();
  }, 2000);
} 