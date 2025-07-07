"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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
    try {
      if (!auth) {
        setError("Firebase Auth n'est pas initialisé.");
        return;
      }
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setOpen(false);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn btn-primary" type="button">{triggerLabel}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? "Se connecter" : "Créer un compte"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && <div className="text-red-500 text-sm">{error}</div>}
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
              Pas de compte ?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setIsLogin(false)}>
                S'inscrire
              </button>
            </span>
          ) : (
            <span>
              Déjà un compte ?{' '}
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