// Importation des fonctions nécessaires de Firebase Firestore
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
// Importation des types et de l'authentification
import { Project } from "@/types/agents";
import { auth } from "@/lib/firebase";

// Initialisation de l'instance Firestore
const db = getFirestore();

// Fonction d'assistance pour vérifier si l'utilisateur est authentifié
const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  const user = auth.currentUser;
  console.log('[FIRESTORE] Utilisateur courant:', user);
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
};

// Helper function to handle Firestore errors
const handleFirestoreError = (error: any, operation: string) => {
  console.error(`Firestore ${operation} error:`, error);
  
  if (error.code === 'permission-denied') {
    throw new Error('Permission denied. Please check your authentication.');
  } else if (error.code === 'unavailable') {
    throw new Error('Firestore is temporarily unavailable. Please try again.');
  } else if (error.code === 'resource-exhausted') {
    throw new Error('Firestore quota exceeded. Please try again later.');
  } else {
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
};

// Retry function for network issues
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on authentication or permission errors
      if (error.message?.includes('not authenticated') || 
          error.message?.includes('Permission denied')) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Offline fallback storage
const getOfflineStorage = () => {
  if (typeof window === 'undefined') return null;
  return {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key)
  };
};

// Save to offline storage as fallback
const saveOffline = (key: string, data: any) => {
  const storage = getOfflineStorage();
  if (storage) {
    try {
      storage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
        offline: true
      }));
    } catch (error) {
      console.warn('Failed to save offline:', error);
    }
  }
};

// Get from offline storage
const getOffline = (key: string) => {
  const storage = getOfflineStorage();
  if (storage) {
    try {
      const item = storage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.data;
      }
    } catch (error) {
      console.warn('Failed to get offline data:', error);
    }
  }
  return null;
};

export async function saveProject(project: Project) {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...project,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef;
    } catch (error: any) {
      // If online save fails, save offline
      if (error.message?.includes('unavailable') || error.code === 'unavailable') {
        saveOffline(`project_${Date.now()}`, { ...project, userId: user.uid });
        throw new Error('Saved offline due to connectivity issues. Will sync when online.');
      }
      handleFirestoreError(error, 'save project');
    }
  });
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error: any) {
      // Try offline fallback
      const offlineData = getOffline('projects');
      if (offlineData) {
        console.warn('Using offline data for projects');
        return offlineData;
      }
      handleFirestoreError(error, 'fetch projects');
    }
  });
}

export async function deleteProject(projectId: string) {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
    } catch (error: any) {
      handleFirestoreError(error, 'delete project');
    }
  });
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      handleFirestoreError(error, 'update project');
    }
  });
}

export async function savePlanDraft({ userId, prompt, plan, files, chatHistory }: { userId: string; prompt: string; plan: any; files: any[]; chatHistory?: { role: 'user' | 'assistant'; content: string }[] }) {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      const docRef = await addDoc(collection(db, "planDrafts"), {
        userId: user.uid,
        prompt,
        plan,
        files,
        ...(chatHistory ? { chatHistory } : {}),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef;
    } catch (error: any) {
      // If online save fails, save offline
      if (error.message?.includes('unavailable') || error.code === 'unavailable') {
        saveOffline(`planDraft_${Date.now()}`, { userId: user.uid, prompt, plan, files, ...(chatHistory ? { chatHistory } : {}) });
        throw new Error('Saved offline due to connectivity issues. Will sync when online.');
      }
      handleFirestoreError(error, 'save plan draft');
    }
  });
}

export async function getUserPlanDrafts(userId: string): Promise<any[]> {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      const q = query(collection(db, "planDrafts"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      // Try offline fallback
      const offlineData = getOffline('planDrafts');
      if (offlineData) {
        console.warn('Using offline data for plan drafts');
        return offlineData;
      }
      handleFirestoreError(error, 'fetch plan drafts');
    }
  });
}

export async function deletePlanDraft(draftId: string) {
  const user = checkAuth();
  
  return retryOperation(async () => {
    try {
      await deleteDoc(doc(db, "planDrafts", draftId));
    } catch (error: any) {
      handleFirestoreError(error, 'delete plan draft');
    }
  });
}

// Real-time listener for plan drafts (optional)
export function subscribeToPlanDrafts(userId: string, callback: (drafts: any[]) => void) {
  const user = checkAuth();
  
  const q = query(collection(db, "planDrafts"), where("userId", "==", user.uid));
  
  return onSnapshot(q, (snapshot) => {
    const drafts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(drafts);
  }, (error) => {
    console.error('Error listening to plan drafts:', error);
  });
}