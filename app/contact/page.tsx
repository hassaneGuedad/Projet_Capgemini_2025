'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, User, Send } from 'lucide-react';

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
        setError(data.error || 'Erreur lors de l\'envoi.');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <Mail className="h-7 w-7 text-blue-400" /> Contactez-nous
      </h1>
      <Card className="mb-8 bg-white/90 border-blue-100 shadow">
        <CardContent className="p-6">
          {sent ? (
            <div className="text-green-700 font-semibold text-center py-8">
              Merci pour votre message ! Nous vous répondrons rapidement.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Nom</label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Votre email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder="Votre message..." />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={loading}>
                <Send className="h-4 w-4 mr-2" /> {loading ? 'Envoi en cours...' : 'Envoyer'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="text-gray-700 text-sm text-center">
        <div className="mb-2">Ou contactez-nous directement :</div>
        <div>Email : <a href="mailto:scapworkspace@gmail.com" className="text-blue-600 underline">supportCapWorkSpace@gmail.com</a></div>
      </div>
    </main>
  );
};

export default Contact; 