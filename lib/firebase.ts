import { initializeApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialisation de Firebase
let app;
let auth: Auth | undefined;
let db: Firestore | undefined;
let firebaseInitialized = false;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialisation de Firestore avec la persistance
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        // Options de cache si nécessaire
      })
    });
    
    firebaseInitialized = true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Firebase:', error);
  }
}

export { app, auth, db, firebaseInitialized };