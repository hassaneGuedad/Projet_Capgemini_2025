'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, User, Send, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'envoi.");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      {/* En-tête */}
      <div className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow mb-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.12),transparent_40%)]" />
        <div className="relative p-6 flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 ring-1 ring-blue-200">
            <Mail className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Contactez-nous</h1>
            <p className="text-sm text-gray-600">Une question, un problème, une idée ? Nous répondons rapidement.</p>
          </div>
        </div>
      </div>

      {/* Contenu principal: Infos + Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Infos */}
        <div className="space-y-4 md:col-span-1">
          <Card className="bg-white/75 backdrop-blur border-blue-50">
            <CardContent className="p-4">
              <div className="text-sm text-gray-700">
                <div className="mb-3">
                  <div className="font-semibold text-gray-900">Support CapWorkSpace</div>
                  <div className="text-xs text-gray-500">Nous revenons vers vous sous 24-48h</div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <a href="mailto:scapworkspace@gmail.com" className="text-blue-700 hover:underline">scapWorkSpace@gmail.com</a>
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Du lundi au vendredi — 9h à 18h </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/75 backdrop-blur border-blue-50">
            <CardContent className="p-4">
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Conseils</div>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Décrivez précisément votre besoin pour une réponse plus efficace.</li>
                  <li>Pour des bugs, joignez le message d'erreur et le contexte.</li>
                  <li>Pour des idées produit, indiquez l'usage envisagé.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne Formulaire */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur border-blue-100 shadow">
            <CardContent className="p-6">
              {sent ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="font-semibold text-green-700">Merci pour votre message !</div>
                  <div className="text-sm text-gray-600">Nous vous répondrons rapidement à votre adresse e-mail.</div>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setSent(false)}
                  >
                    Envoyer un autre message
                  </Button>
                  <div className="mt-4 text-sm text-gray-700 text-center">
                    <div className="font-medium">Ou contactez-nous directement :</div>
                    <div>
                      Email : <a href="mailto:scapWorkSpace@gmail.com" className="text-blue-600 underline">scapWorkSpace@gmail.com</a>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Nom</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User className="h-4 w-4" /></span>
                      <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="h-4 w-4" /></span>
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Votre email" className="pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                    <Textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder="Votre message..." rows={6} />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-100 rounded p-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Envoyer
                      </>
                    )}
                  </Button>
                  <div className="text-[11px] text-gray-500 text-center">Vos données ne seront utilisées que pour traiter votre demande.</div>
                  <div className="mt-4 text-sm text-gray-700 text-center">
                    <div className="font-medium">Ou contactez-nous directement :</div>
                    <div>
                      Email : <a href="mailto:scapWorkSpace@gmail.com" className="text-blue-600 underline">scapWorkSpace@gmail.com</a>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

          </main>
  );
};

export default Contact;
