'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Info, Lightbulb } from 'lucide-react';

const examplePrompts = [
  {
    title: 'Créer une application e-commerce',
    content: 'Créer une application e-commerce avec React, Node.js et MongoDB',
  },
  {
    title: 'Développer un blog',
    content: 'Développer un blog avec Next.js, TypeScript et Tailwind CSS',
  },
  {
    title: 'API REST',
    content: 'Construire une API REST avec Express et PostgreSQL',
  },
  {
    title: 'Chat en temps réel',
    content: 'Créer une application de chat en temps réel avec Vue.js et Firebase',
  },
];

const faq = [
  {
    question: "Comment puis-je modifier un projet après l'avoir généré ?",
    answer: "Utilisez l'éditeur intégré dans le dashboard pour modifier les fichiers de votre projet. Vous pouvez aussi demander au chatbot de modifier un fichier spécifique !",
  },
  {
    question: "Puis-je exporter mon projet ?",
    answer: "Oui, cliquez sur le bouton d'export dans le dashboard pour télécharger votre projet au format ZIP.",
  },
  {
    question: "Comment contacter le support ?",
    answer: "Envoyez un email à support@capworkspace.com ou utilisez la section d'aide intégrée.",
  },
];

const tipOfTheDay = {
  title: 'Astuce du jour',
  content: "Utilisez la commande /search suivie d'un mot-clé dans le chatbot pour rechercher rapidement dans tout votre code !",
};

const Guide = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <Sparkles className="h-7 w-7 text-yellow-400" /> Guide d’utilisation
      </h1>

      {/* Astuce du jour */}
      <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-3">
        <Lightbulb className="text-yellow-500 h-6 w-6" />
        <div>
          <div className="font-semibold text-yellow-800">{tipOfTheDay.title}</div>
          <div className="text-yellow-900">{tipOfTheDay.content}</div>
        </div>
      </div>

      {/* Exemples de prompts */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" /> Exemples de prompts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examplePrompts.map((ex, idx) => (
            <Card key={ex.title} className="bg-white/90 border-blue-100 shadow hover:shadow-lg transition">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="font-semibold text-blue-700 flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">Exemple</Badge>
                  {ex.title}
                </div>
                <div className="text-gray-700 text-sm mb-2">{ex.content}</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit"
                  onClick={() => handleCopy(ex.content, idx)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copiedIndex === idx ? 'Copié !' : 'Copier'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Guide classique */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Découverte de la page d’accueil</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Un aperçu des fonctionnalités principales (IA, code optimisé, architecture modulaire...)</li>
          <li>Des statistiques sur l’utilisation de la plateforme</li>
          <li>Un formulaire central pour <b>décrire votre projet</b> et générer un prompt</li>
          <li>Des suggestions de prompts pour vous inspirer</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Créer un prompt</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Dans la section “Décrivez votre projet”, saisissez une description détaillée de votre projet web.</li>
          <li>Vous pouvez utiliser la saisie vocale (icône micro) pour dicter votre prompt.</li>
          <li>Des suggestions de prompts sont disponibles pour vous aider à démarrer rapidement.</li>
          <li>La plateforme détecte automatiquement les technologies mentionnées (React, Node.js, etc.) et vous permet de les sélectionner/désélectionner.</li>
          <li>Cliquez sur <b>Générer</b> pour lancer la création du plan et du code.</li>
          <li>Vous serez redirigé vers le dashboard pour explorer le résultat.</li>
        </ol>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Interagir avec le chatbot</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Un bouton flottant en bas à droite permet d’ouvrir le chatbot à tout moment.</li>
          <li>Posez vos questions en langage naturel ou utilisez des commandes spéciales (ex : <code>/search mot-clé</code> pour rechercher dans le code).</li>
          <li>Le chatbot peut expliquer un fichier, modifier du code, ou répondre à vos questions sur le projet.</li>
          <li>Vous pouvez poursuivre la conversation ou demander d’autres actions.</li>
        </ol>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Utiliser le dashboard</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Retrouvez tous vos projets générés et vos plans dans le dashboard.</li>
          <li>Explorez la structure du projet via l’explorateur de fichiers.</li>
          <li>Ouvrez, modifiez et sauvegardez les fichiers grâce à l’éditeur intégré.</li>
          <li>Utilisez les onglets pour travailler sur plusieurs fichiers en même temps.</li>
          <li>Exportez votre projet au format ZIP ou partagez-le.</li>
          <li>Accédez à l’historique de vos conversations avec le chatbot pour chaque projet.</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">5. Conseils d’utilisation</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Formulez des prompts clairs et précis pour de meilleurs résultats.</li>
          <li>N’hésitez pas à explorer les suggestions et à modifier les technologies détectées.</li>
          <li>Utilisez le chatbot pour toute question ou modification rapide de code.</li>
          <li>Consultez régulièrement le dashboard pour suivre vos projets et plans.</li>
        </ul>
      </section>

      {/* FAQ interactive */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faq.map((item, idx) => (
            <AccordionItem value={`faq-${idx}`} key={item.question}>
              <AccordionTrigger className="text-blue-700 font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">6. Ressources et support</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>FAQ et documentation technique (à venir)</li>
          <li>Support : support@capworkspace.com</li>
        </ul>
      </section>
    </main>
  );
};

export default Guide; 