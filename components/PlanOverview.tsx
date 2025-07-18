'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plan } from '@/types/agents';
import { 
  CheckCircle, 
  Clock, 
  Code, 
  Layers, 
  Target, 
  TrendingUp,
  Zap,
  Download,
  Play,
  Settings,
  Share2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { savePlanDraft } from '@/services/firestore';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface PlanOverviewProps {
  plan: Plan;
  onAllStepsValidated?: () => void;
  showValidateButton?: boolean;
}

const stepsLabels = [
  'Stack technique',
  'Fonctionnalités',
  'Étapes',
  'Fichiers à générer',
  'Commandes à exécuter',
];

export const PlanOverview: React.FC<PlanOverviewProps> = ({ plan, onAllStepsValidated, showValidateButton = true }) => {
  // Suppression de toute la logique d'étapes, d'édition, de sauvegarde, etc.
  // On ne garde qu'un bouton pour valider le prompt et générer le projet

  const handleValidatePrompt = () => {
    if (onAllStepsValidated) onAllStepsValidated();
  };

  const [showAnimated, setShowAnimated] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  useEffect(() => {
    if (!showValidateButton) {
      setShowAnimated(false);
      setShowBanner(true);
      setTimeout(() => setShowAnimated(true), 50);
    }
  }, [showValidateButton]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {showValidateButton ? (
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg font-semibold"
          onClick={handleValidatePrompt}
        >
          Valider le prompt et générer le projet
        </button>
      ) : (
        showBanner && (
          <div
            className={`relative flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-lg mt-6 transition-all duration-700 ease-out
              ${showAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
          >
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-2 right-4 text-white hover:text-red-200 font-bold text-2xl px-2"
              aria-label="Fermer le message"
            >
              ×
            </button>
            <CheckCircle2 className="h-8 w-8 mr-4 text-white flex-shrink-0 animate-bounce" />
            <span className="text-center">
              🎉 Plan restauré avec succès !<br />
              Vous pouvez maintenant explorer, modifier et sauvegarder vos fichiers.<br />
              <span className="font-normal">N’oubliez pas d’exporter votre projet une fois terminé.</span>
            </span>
          </div>
        )
      )}
    </div>
  );
};