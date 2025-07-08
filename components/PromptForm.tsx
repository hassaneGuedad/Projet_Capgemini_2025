'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
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

  // Détecter les technologies quand le prompt change
  useEffect(() => {
    const techs = detectTechnologies(prompt);
    setDetectedTechs(techs);
    
    // Garder uniquement les technologies sélectionnées qui sont encore détectées
    setSelectedTechs(prev => 
      prev.filter((tech: TechId) => techs.includes(tech))
    );
  }, [prompt]);

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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        onSubmit(finalPrompt);
      }
      
      // Store the prompt in localStorage for the dashboard
      localStorage.setItem('currentPrompt', finalPrompt);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

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
            <Textarea
              className="min-h-[120px] mb-4"
              placeholder="Décrivez votre projet en détail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
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