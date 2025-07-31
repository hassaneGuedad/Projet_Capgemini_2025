"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthDialog({ triggerLabel = "Se connecter" }: { triggerLabel?: string }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    console.log('🔍 === DÉBUT PROCESSUS AUTHENTIFICATION ===');
    console.log('🔍 Email:', email);
    console.log('🔍 Mode:', isLogin ? 'CONNEXION' : 'INSCRIPTION');
    console.log('🔍 Timestamp:', new Date().toISOString());
    
    // Validation basique de l'email
    if (!email || !email.trim()) {
      console.log('❌ Email manquant');
      setError("Email requis");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Format d\'email invalide:', email);
      setError("Format d'email invalide");
      return;
    }
    
    try {
      if (!auth) {
        console.log('❌ Firebase Auth non initialisé');
        setError("Firebase Auth n'est pas initialisé.");
        return;
      }

      // VÉRIFICATION EMAIL AUTORISÉ AVANT TOUTE AUTHENTIFICATION
      console.log('🔍 === VÉRIFICATION EMAIL AUTORISÉ ===');
      console.log('🔍 Début de la vérification pour:', email);
      
      try {
        console.log('🔍 Appel API /api/auth/check-email...');
        const checkResponse = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        console.log('🔍 Status de la réponse:', checkResponse.status);
        console.log('🔍 Headers de la réponse:', Object.fromEntries(checkResponse.headers.entries()));
        
        const checkData = await checkResponse.json();
        console.log('🔍 Données de la réponse:', checkData);

        if (!checkResponse.ok) {
          console.error('❌ Erreur API vérification email:', checkData);
          const errorMessage = checkData.error || 'Erreur lors de la vérification de l\'email';
          console.log('❌ Affichage erreur:', errorMessage);
          setError(errorMessage);
          return;
        }

        if (!checkData.isAuthorized) {
          console.log('❌ === EMAIL NON AUTORISÉ ===');
          console.log('❌ Email rejeté:', email);
          console.log('❌ Raison: Email non dans la liste autorisée');
          console.log('❌ BLOCAGE COMPLET - Pas d\'authentification Firebase');
          
          const errorMessage = '❌ Cet email n\'est pas autorisé à accéder à la plateforme. Seuls les emails ajoutés par l\'administrateur peuvent se connecter. Veuillez contacter l\'administrateur (scapworkspace@gmail.com).';
          console.log('❌ Affichage erreur:', errorMessage);
          setError(errorMessage);
          
          // Forcer l'affichage de l'erreur et empêcher la fermeture du formulaire
          console.log('🔍 Forçage de l\'affichage de l\'erreur...');
          console.log('🔍 Empêchement de la fermeture du formulaire...');
          console.log('🔍 BLOCAGE COMPLET - Aucun appel à Firebase Auth');
          
          return;
        }
        
        console.log('✅ === EMAIL AUTORISÉ ===');
        console.log('✅ Email accepté:', email);
        console.log('✅ Procédure d\'authentification Firebase autorisée...');
      } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
        const errorMessage = 'Erreur de connexion lors de la vérification de l\'email';
        console.log('❌ Affichage erreur:', errorMessage);
        setError(errorMessage);
        return;
      }

      // AUTHENTIFICATION FIREBASE (seulement si email autorisé)
      console.log('🔍 === AUTHENTIFICATION FIREBASE ===');
      let userCredential;
      
      try {
        if (isLogin) {
          console.log('🔍 Tentative de connexion...');
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Connexion Firebase réussie');
        } else {
          console.log('🔍 Tentative d\'inscription...');
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('✅ Inscription Firebase réussie');
        }
        
        console.log('🔍 === REDIRECTION ===');
        setOpen(false);
        router.push("/dashboard");
        console.log('✅ === PROCESSUS TERMINÉ AVEC SUCCÈS ===');
        
      } catch (firebaseError: any) {
        console.error('❌ === ERREUR AUTHENTIFICATION FIREBASE ===');
        console.error('❌ Erreur Firebase:', firebaseError);
        console.error('❌ Code d\'erreur:', firebaseError.code);
        console.error('❌ Message d\'erreur:', firebaseError.message);
        console.log('❌ Affichage erreur Firebase:', firebaseError.message);
        setError(firebaseError.message);
      }
    } catch (err: any) {
      console.error('❌ === ERREUR GÉNÉRALE ===');
      console.error('❌ Erreur:', err);
      console.log('❌ Affichage erreur générale:', err.message);
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Empêcher la fermeture du formulaire s'il y a une erreur
      if (error && !newOpen) {
        console.log('🔍 Tentative de fermeture du formulaire avec erreur - EMPÊCHÉE');
        return;
      }
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <button className="btn btn-primary" type="button">{triggerLabel}</button>
      </DialogTrigger>
      <DialogContent aria-describedby="auth-description">
        <div id="auth-description" className="sr-only">
          Formulaire d'authentification pour {isLogin ? 'se connecter' : 's\'inscrire'}
        </div>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Se connecter" : "Créer un compte"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
              <div className="font-semibold">❌ Erreur d'autorisation :</div>
              <div>{error}</div>
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input input-bordered w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <div className="text-center mt-2">
          {isLogin ? (
            <span>
              Pas de compte ?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setIsLogin(false)}>
                S'inscrire
              </button>
            </span>
          ) : (
            <span>
              Déjà un compte ?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setIsLogin(true)}>
                Se connecter
              </button>
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 