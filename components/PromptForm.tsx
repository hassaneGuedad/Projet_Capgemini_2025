'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, X, Mic, ChevronDown, Bot, Brain } from 'lucide-react';
import { detectTechnologies, getTechDisplayName, getTechIcon, type TechId } from '@/lib/tech-detector';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PromptFormProps {
  onSubmit?: (prompt: string) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedTechs, setDetectedTechs] = useState<TechId[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<TechId[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const [includeSupabase, setIncludeSupabase] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'claude-sonnet' | 'deepseek'>('claude-sonnet');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Détecter les technologies quand le prompt change
  useEffect(() => {
    const techs = detectTechnologies(prompt);
    setDetectedTechs(techs);
    
    // Garder uniquement les technologies sélectionnées qui sont encore détectées
    setSelectedTechs(prev => 
      prev.filter((tech: TechId) => techs.includes(tech))
    );
  }, [prompt]);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    if (!showModelDropdown) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('model-select');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModelDropdown]);

  const toggleTech = (tech: TechId) => {
    setSelectedTechs(prev => 
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const suggestedPrompts = [
    "Créer une application e-commerce avec React, Node.js et MongoDB",
    "Développer un blog avec Next.js, TypeScript et Tailwind CSS",
    "Construire une API REST avec Express et PostgreSQL",
    "Créer une application de chat en temps réel avec Vue.js et Firebase"
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({ title: 'Erreur', description: 'La reconnaissance vocale n\'est pas supportée par ce navigateur.' });
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev ? prev + ' ' + transcript : transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (!isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!user) {
      alert("Il est nécessaire de se connecter. Si vous n'avez pas de compte, veuillez en créer un.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      // Préparer le prompt final avec les technologies sélectionnées
      let finalPrompt = prompt;
      if (selectedTechs.length > 0) {
        const techList = selectedTechs.map(tech => `- ${getTechDisplayName(tech)}`).join('\n');
        finalPrompt = `Technologies à utiliser (sélectionnées par l'utilisateur) :\n${techList}\n\n${prompt}`;
      }
      if (includeSupabase) {
        finalPrompt = `INCLURE_SUPABASE\n${finalPrompt}`;
      }
      
      // Stocker le prompt et le modèle pour le dashboard
      localStorage.setItem('currentPrompt', finalPrompt);
      localStorage.setItem('currentModel', selectedModel);
      
      if (onSubmit) {
        onSubmit(finalPrompt);
      }
      
      // Redirection immédiate vers le dashboard
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message || 'Erreur lors de la préparation du projet.' });
      console.error('Erreur lors de la soumission :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const modelOptions = [
    {
      value: 'claude-sonnet',
      label: 'Claude Sonnet',
      icon: <Bot className="w-5 h-5 text-blue-600" />,
      description: "Anthropic Claude Sonnet : très bon pour la compréhension, la planification et le code général."
    },
    {
      value: 'deepseek',
      label: 'Deepseek',
      icon: <Brain className="w-5 h-5 text-green-600" />,
      description: "Deepseek : spécialisé dans la génération de code, très performant pour les projets complexes."
    }
  ];

  const selectedModelOption = modelOptions.find(opt => opt.value === selectedModel);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Décrivez votre projet
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Expliquez en détail le projet web que vous souhaitez créer. Plus vous êtes précis, meilleur sera le résultat !
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Textarea
                className="min-h-[120px] mb-4"
                placeholder="Décrivez votre projet en détail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                type="button"
                variant={isListening ? 'secondary' : 'outline'}
                className={`h-12 w-12 flex-shrink-0 ${isListening ? 'animate-pulse bg-blue-100' : ''}`}
                onClick={handleVoiceInput}
                aria-label="Saisie vocale"
              >
                <Mic className={`h-6 w-6 ${isListening ? 'text-blue-600' : 'text-gray-500'}`} />
              </Button>
            </div>
            {/* Sélecteur de modèle IA sous forme de boutons radio stylisés */}
            <div className="mb-2">
              <label className="text-sm text-gray-700 font-medium block mb-1">Modèle IA :</label>
              <div className="flex gap-4">
                <label className={`flex items-center cursor-pointer px-3 py-2 border rounded-lg shadow-sm transition bg-white hover:bg-blue-50 border-blue-200 font-medium space-x-2 ring-2 ring-transparent focus-within:ring-blue-500 ${selectedModel === 'claude-sonnet' ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-400' : ''}`}>
                  <input
                    type="radio"
                    name="model"
                    value="claude-sonnet"
                    checked={selectedModel === 'claude-sonnet'}
                    onChange={() => setSelectedModel('claude-sonnet')}
                    className="hidden"
                  />
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span>Claude Sonnet</span>
                </label>
                <label className={`flex items-center cursor-pointer px-3 py-2 border rounded-lg shadow-sm transition bg-white hover:bg-green-50 border-green-200 font-medium space-x-2 ring-2 ring-transparent focus-within:ring-green-500 ${selectedModel === 'deepseek' ? 'bg-green-100 border-green-500 ring-2 ring-green-400' : ''}`}>
                  <input
                    type="radio"
                    name="model"
                    value="deepseek"
                    checked={selectedModel === 'deepseek'}
                    onChange={() => setSelectedModel('deepseek')}
                    className="hidden"
                  />
                  <Brain className="w-5 h-5 text-green-600" />
                  <span>Deepseek</span>
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-1 min-h-[1.5em]">
                {selectedModel === 'claude-sonnet'
                  ? "Anthropic Claude Sonnet : très bon pour la compréhension, la planification et le code général."
                  : "Deepseek : spécialisé dans la génération de code, très performant pour les projets complexes."}
              </div>
              <div className="mt-2">
                {selectedModel === 'claude-sonnet' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    <Bot className="w-4 h-4 mr-1" /> Modèle sélectionné : Claude Sonnet
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <Brain className="w-4 h-4 mr-1" /> Modèle sélectionné : Deepseek
                  </span>
                )}
              </div>
            </div>
            
            {detectedTechs.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Technologies détectées :</h3>
                <div className="flex flex-wrap gap-2">
                  {detectedTechs.map((tech: TechId) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        selectedTechs.includes(tech)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span>{getTechIcon(tech)}</span>
                      <span>{getTechDisplayName(tech)}</span>
                      {selectedTechs.includes(tech) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cliquez pour sélectionner/désélectionner les technologies
                </p>
              </div>
            )}
          </div>
          
          {/* Option Supabase */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-supabase"
              checked={includeSupabase}
              onChange={e => setIncludeSupabase(e.target.checked)}
              className="accent-blue-600 h-4 w-4"
            />
            <label htmlFor="include-supabase" className="text-sm text-gray-700 select-none">
              Inclure <b>Supabase</b> (ajoute la configuration et les dépendances Supabase au projet)
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Générer mon projet
              </>
            )}
          </Button>
        </form>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>Exemples de prompts</span>
          </h3>
          <div className="grid gap-2">
            {suggestedPrompts.map((suggestedPrompt, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:border-blue-200 transition-colors duration-200 p-3 h-auto text-left justify-start text-sm"
                onClick={() => handleSuggestedPrompt(suggestedPrompt)}
              >
                {suggestedPrompt}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};