"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Loader2, ShieldAlert } from "lucide-react";

export default function AuthDialog({ triggerLabel = "Se connecter" }: { triggerLabel?: string }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    console.log('🔍 === DÉBUT PROCESSUS AUTHENTIFICATION ===');
    console.log('🔍 Email:', email);
    console.log('🔍 Mode:', isLogin ? 'CONNEXION' : 'INSCRIPTION');
    console.log('🔍 Timestamp:', new Date().toISOString());

    // Validation basique de l'email
    if (!email || !email.trim()) {
      console.log('❌ Email manquant');
      setError("Email requis");
      setSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Format d'email invalide:", email);
      setError("Format d'email invalide");
      setSubmitting(false);
      return;
    }

    try {
      if (!auth) {
        console.log('❌ Firebase Auth non initialisé');
        setError("Firebase Auth n'est pas initialisé.");
        setSubmitting(false);
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
        const checkData = await checkResponse.json();
        console.log('🔍 Données de la réponse:', checkData);

        if (!checkResponse.ok) {
          console.error("❌ Erreur API vérification email:", checkData);
          const errorMessage = checkData.error || "Erreur lors de la vérification de l'email";
          setError(errorMessage);
          setSubmitting(false);
          return;
        }

        if (!checkData.isAuthorized) {
          console.log('❌ === EMAIL NON AUTORISÉ ===');
          const errorMessage = "❌ Cet email n'est pas autorisé à accéder à la plateforme. Seuls les emails ajoutés par l'administrateur peuvent se connecter. Veuillez contacter l'administrateur (scapworkspace@gmail.com).";
          setError(errorMessage);
          setSubmitting(false);
          return;
        }

        console.log('✅ === EMAIL AUTORISÉ ===');
      } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
        const errorMessage = "Erreur de connexion lors de la vérification de l'email";
        setError(errorMessage);
        setSubmitting(false);
        return;
      }

      // AUTHENTIFICATION FIREBASE (seulement si email autorisé)
      console.log('🔍 === AUTHENTIFICATION FIREBASE ===');
      try {
        if (isLogin) {
          console.log('🔍 Tentative de connexion...');
          await signInWithEmailAndPassword(auth, email, password);
          console.log('✅ Connexion Firebase réussie');
        } else {
          console.log("🔍 Tentative d'inscription...");
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('✅ Inscription Firebase réussie');
        }

        console.log('🔍 === REDIRECTION ===');
        setOpen(false);
        router.push('/dashboard');
        console.log('✅ === PROCESSUS TERMINÉ AVEC SUCCÈS ===');
      } catch (firebaseError: any) {
        console.error('❌ === ERREUR AUTHENTIFICATION FIREBASE ===');
        console.error('❌ Erreur Firebase:', firebaseError);
        setError(firebaseError.message || 'Erreur de connexion.');
      } finally {
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error('❌ === ERREUR GÉNÉRALE ===');
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur inconnue');
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (error && !newOpen) return; // Empêche la fermeture si erreur visible
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow"
        >
          <LogIn className="h-4 w-4 mr-2" /> {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] border rounded-xl">
        <div id="auth-description" className="sr-only">
          Formulaire d'authentification pour {isLogin ? 'se connecter' : "s'inscrire"}
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold tracking-tight">
            {isLogin ? 'Se connecter' : 'Créer un compte'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 border border-red-200 rounded p-3">
            <ShieldAlert className="h-4 w-4 mt-0.5" />
            <div>
              <div className="font-semibold">Erreur</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@mail.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-2 text-sm">
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