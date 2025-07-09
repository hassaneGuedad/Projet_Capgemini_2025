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
  CheckCircle2
} from 'lucide-react';
import { savePlanDraft } from '@/services/firestore';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface PlanOverviewProps {
  plan: Plan;
  onAllStepsValidated?: () => void;
}

const stepsLabels = [
  'Stack technique',
  'Fonctionnalités',
  'Étapes',
  'Fichiers à générer',
  'Commandes à exécuter',
];

export const PlanOverview: React.FC<PlanOverviewProps> = ({ plan, onAllStepsValidated }) => {
  // Suppression de toute la logique d'étapes, d'édition, de sauvegarde, etc.
  // On ne garde qu'un bouton pour valider le prompt et générer le projet

  const handleValidatePrompt = () => {
    if (onAllStepsValidated) onAllStepsValidated();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
          <button
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg font-semibold"
        onClick={handleValidatePrompt}
      >
        Valider le prompt et générer le projet
          </button>
    </div>
  );
};