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
  const [currentStep, setCurrentStep] = useState(0);
  const [validated, setValidated] = useState<boolean[]>([false, false, false, false, false]);
  const [editMode, setEditMode] = useState(false);
  const [localPlan, setLocalPlan] = useState<Plan>(plan);
  const [stackEdit, setStackEdit] = useState(localPlan.stack.join('\n'));
  const [featuresEdit, setFeaturesEdit] = useState(localPlan.features.join('\n'));
  const [stepsEdit, setStepsEdit] = useState(localPlan.steps.join('\n'));
  const [filesEdit, setFilesEdit] = useState(localPlan.files.map(f => `${f.path}:${f.description}`).join('\n'));
  const [commandsEdit, setCommandsEdit] = useState(localPlan.commands.join('\n'));
  const [notification, setNotification] = useState<string | null>(null);
  const { user } = useAuth ? useAuth() : { user: null };
  const [saveLoading, setSaveLoading] = useState(false);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  // Charger le plan modifié depuis localStorage si présent
  useEffect(() => {
    const saved = localStorage.getItem('editedPlan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalPlan(parsed);
        setStackEdit(parsed.stack.join('\n'));
        setFeaturesEdit(parsed.features.join('\n'));
        setStepsEdit(parsed.steps.join('\n'));
        setFilesEdit(parsed.files.map((f: any) => `${f.path}:${f.description}`).join('\n'));
        setCommandsEdit(parsed.commands.join('\n'));
      } catch {}
    } else {
      setLocalPlan(plan);
      setStackEdit(plan.stack.join('\n'));
      setFeaturesEdit(plan.features.join('\n'));
      setStepsEdit(plan.steps.join('\n'));
      setFilesEdit(plan.files.map(f => `${f.path}:${f.description}`).join('\n'));
      setCommandsEdit(plan.commands.join('\n'));
    }
  }, [plan]);

  // Sauvegarder le plan modifié dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('editedPlan', JSON.stringify(localPlan));
  }, [localPlan]);

  // Autosave en base à chaque modification du plan
  useEffect(() => {
    if (user && localPlan) {
      // Annuler le timeout précédent
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
      // Déclencher la sauvegarde après 1.5 secondes d'inactivité
      autosaveRef.current = setTimeout(async () => {
        try {
          await savePlanDraft({ 
            userId: user.id, 
            prompt: localStorage.getItem('currentPrompt') || '', 
            plan: localPlan 
          });
          // Success - no need to show toast for autosave
        } catch (error: any) {
          console.warn('Erreur lors de l\'autosave:', error);
          
          // Show user-friendly error message for specific errors
          if (error.message?.includes('not authenticated')) {
            console.warn('User not authenticated for autosave');
          } else if (error.message?.includes('Permission denied')) {
            console.warn('Permission denied for autosave');
          } else if (error.message?.includes('unavailable')) {
            console.warn('Firestore temporarily unavailable');
          }
          // Don't show toast for autosave errors to avoid spam
        }
      }, 1500);
    }
    // Cleanup
    return () => {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
    };
  }, [localPlan, user]);

  useEffect(() => {
    if (validated.every(Boolean) && onAllStepsValidated) {
      onAllStepsValidated();
    }
  }, [validated, onAllStepsValidated]);

  const handleValidate = () => {
    const newValidated = [...validated];
    newValidated[currentStep] = true;
    setValidated(newValidated);
    if (currentStep < stepsLabels.length - 1) {
      setCurrentStep(currentStep + 1);
      setEditMode(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    let updatedPlan = { ...localPlan };
    if (currentStep === 0) {
      updatedPlan.stack = stackEdit.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (currentStep === 1) {
      updatedPlan.features = featuresEdit.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (currentStep === 2) {
      updatedPlan.steps = stepsEdit.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (currentStep === 3) {
      updatedPlan.files = filesEdit.split('\n').map(line => {
        const [path, ...desc] = line.split(':');
        return { path: path.trim(), description: desc.join(':').trim() };
      }).filter(f => f.path && f.description);
    }
    if (currentStep === 4) {
      updatedPlan.commands = commandsEdit.split('\n').map(s => s.trim()).filter(Boolean);
    }
    setLocalPlan(updatedPlan);
    setEditMode(false);
    toast.success('Modifications enregistrées !');
  };

  // Ajout/suppression dynamique pour chaque section
  const handleAddItem = () => {
    if (currentStep === 0) setStackEdit(stackEdit + '\n');
    if (currentStep === 1) setFeaturesEdit(featuresEdit + '\n');
    if (currentStep === 2) setStepsEdit(stepsEdit + '\n');
    if (currentStep === 3) setFilesEdit(filesEdit + '\n');
    if (currentStep === 4) setCommandsEdit(commandsEdit + '\n');
  };
  const handleRemoveItem = (idx: number) => {
    if (currentStep === 0) {
      const arr = stackEdit.split('\n'); arr.splice(idx, 1); setStackEdit(arr.join('\n'));
    }
    if (currentStep === 1) {
      const arr = featuresEdit.split('\n'); arr.splice(idx, 1); setFeaturesEdit(arr.join('\n'));
    }
    if (currentStep === 2) {
      const arr = stepsEdit.split('\n'); arr.splice(idx, 1); setStepsEdit(arr.join('\n'));
    }
    if (currentStep === 3) {
      const arr = filesEdit.split('\n'); arr.splice(idx, 1); setFilesEdit(arr.join('\n'));
    }
    if (currentStep === 4) {
      const arr = commandsEdit.split('\n'); arr.splice(idx, 1); setCommandsEdit(arr.join('\n'));
    }
  };

  const handleSavePlanDraft = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder le plan.");
      return;
    }
    setSaveLoading(true);
    try {
      await savePlanDraft({ userId: user.id, prompt: localStorage.getItem('currentPrompt') || '', plan: localPlan });
      toast.success('Plan sauvegardé avec succès !');
    } catch (error: any) {
      console.error('Save plan draft error:', error);
      
      // Provide specific error messages
      if (error.message?.includes('not authenticated')) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.message?.includes('Permission denied')) {
        toast.error('Permission refusée. Vérifiez vos droits d\'accès.');
      } else if (error.message?.includes('unavailable')) {
        toast.error('Service temporairement indisponible. Réessayez plus tard.');
      } else if (error.message?.includes('quota exceeded')) {
        toast.error('Quota dépassé. Réessayez plus tard.');
      } else {
        toast.error('Erreur lors de la sauvegarde du plan.');
      }
    }
    setSaveLoading(false);
  };

  // Fonction pour partager le plan
  const handleSharePlan = async () => {
    setShareLoading(true);
    try {
      // Générer un lien unique pour ce plan
      const planData = {
        plan: localPlan,
        prompt: localStorage.getItem('currentPrompt') || '',
        sharedAt: new Date().toISOString(),
        sharedBy: user?.id || 'anonymous'
      };
      
      // Encoder les données du plan en base64 pour l'URL
      const encodedPlan = btoa(JSON.stringify(planData));
      const shareLink = `${window.location.origin}/dashboard?sharedPlan=${encodedPlan}`;
      
      // Copier le lien dans le presse-papier
      await navigator.clipboard.writeText(shareLink);
      toast.success('Lien de partage copié dans le presse-papier !');
    } catch (error) {
      toast.error('Erreur lors de la génération du lien de partage.');
    }
    setShareLoading(false);
  };

  // Affichage de la section courante
  const renderStep = () => {
    switch (currentStep) {
      case 0:
  return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Stack technique</h2>
            {editMode ? (
              <>
                <textarea
                  className="w-full border rounded p-2 min-h-[100px] font-mono"
                  value={stackEdit}
                  onChange={e => setStackEdit(e.target.value)}
                  placeholder="Une technologie par ligne"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-200 rounded" onClick={handleAddItem} type="button">+ Ajouter</button>
                  {stackEdit.split('\n').length > 1 && stackEdit.split('\n').map((_, idx) => (
                    <button key={idx} className="px-2 py-1 bg-red-200 rounded" onClick={() => handleRemoveItem(idx)} type="button">- {idx + 1}</button>
                  ))}
            </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {localPlan.stack.map((tech: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tech}</span>
                ))}
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Fonctionnalités</h2>
            {editMode ? (
              <>
                <textarea
                  className="w-full border rounded p-2 min-h-[100px] font-mono"
                  value={featuresEdit}
                  onChange={e => setFeaturesEdit(e.target.value)}
                  placeholder="Une fonctionnalité par ligne"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-200 rounded" onClick={handleAddItem} type="button">+ Ajouter</button>
                  {featuresEdit.split('\n').length > 1 && featuresEdit.split('\n').map((_, idx) => (
                    <button key={idx} className="px-2 py-1 bg-red-200 rounded" onClick={() => handleRemoveItem(idx)} type="button">- {idx + 1}</button>
                  ))}
              </div>
              </>
            ) : (
              <ul className="list-disc ml-6">
                {localPlan.features.map((feature: string, idx: number) => (
                  <li key={idx} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            )}
              </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Étapes</h2>
            {editMode ? (
              <>
                <textarea
                  className="w-full border rounded p-2 min-h-[100px] font-mono"
                  value={stepsEdit}
                  onChange={e => setStepsEdit(e.target.value)}
                  placeholder="Une étape par ligne"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-200 rounded" onClick={handleAddItem} type="button">+ Ajouter</button>
                  {stepsEdit.split('\n').length > 1 && stepsEdit.split('\n').map((_, idx) => (
                    <button key={idx} className="px-2 py-1 bg-red-200 rounded" onClick={() => handleRemoveItem(idx)} type="button">- {idx + 1}</button>
                  ))}
            </div>
              </>
            ) : (
              <ol className="list-decimal ml-6">
                {localPlan.steps.map((step: string, idx: number) => (
                  <li key={idx} className="text-gray-700">{step}</li>
                ))}
              </ol>
            )}
              </div>
        );
      case 3:
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Fichiers à générer</h2>
            {editMode ? (
              <>
                <textarea
                  className="w-full border rounded p-2 min-h-[100px] font-mono"
                  value={filesEdit}
                  onChange={e => setFilesEdit(e.target.value)}
                  placeholder="Chemin:Description par ligne"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-200 rounded" onClick={handleAddItem} type="button">+ Ajouter</button>
                  {filesEdit.split('\n').length > 1 && filesEdit.split('\n').map((_, idx) => (
                    <button key={idx} className="px-2 py-1 bg-red-200 rounded" onClick={() => handleRemoveItem(idx)} type="button">- {idx + 1}</button>
                  ))}
              </div>
              </>
            ) : (
              <ul className="list-disc ml-6">
                {localPlan.files.map((file: { path: string; description: string }, idx: number) => (
                  <li key={idx} className="text-gray-700"><b>{file.path}</b> — {file.description}</li>
                ))}
              </ul>
            )}
            </div>
        );
      case 4:
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Commandes à exécuter</h2>
            {editMode ? (
              <>
                <textarea
                  className="w-full border rounded p-2 min-h-[100px] font-mono"
                  value={commandsEdit}
                  onChange={e => setCommandsEdit(e.target.value)}
                  placeholder="Une commande par ligne"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-200 rounded" onClick={handleAddItem} type="button">+ Ajouter</button>
                  {commandsEdit.split('\n').length > 1 && commandsEdit.split('\n').map((_, idx) => (
                    <button key={idx} className="px-2 py-1 bg-red-200 rounded" onClick={() => handleRemoveItem(idx)} type="button">- {idx + 1}</button>
                  ))}
                </div>
              </>
            ) : (
              <ul className="list-disc ml-6">
                {localPlan.commands.map((cmd: string, idx: number) => (
                  <li key={idx} className="font-mono text-gray-800 bg-gray-100 rounded px-2 py-1 mb-1">{cmd}</li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progression */}
      <div className="flex items-center gap-4 mb-4">
        {stepsLabels.map((label, idx) => (
          <div key={idx} className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx === currentStep ? 'border-blue-600 bg-blue-100 text-blue-700' : validated[idx] ? 'border-green-500 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-50 text-gray-400'}`}>{idx + 1}</div>
            {idx < stepsLabels.length - 1 && <div className="w-8 h-1 bg-gray-200 mx-1 rounded" />}
              </div>
            ))}
        <span className="ml-4 text-sm text-gray-600">Étape {currentStep + 1} / {stepsLabels.length}</span>
        <div className="flex gap-2 ml-auto">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            onClick={handleSavePlanDraft}
            disabled={saveLoading}
          >
            {saveLoading ? 'Sauvegarde...' : 'Sauvegarder le plan'}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSharePlan}
            disabled={shareLoading}
          >
            {shareLoading ? 'Partage...' : 'Partager le plan'}
          </button>
        </div>
      </div>
      {/* Notification */}
      {notification && <div className="p-2 bg-green-100 text-green-700 rounded text-center">{notification}</div>}
      {/* Section courante */}
      {renderStep()}
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {!editMode && !validated[currentStep] && (
          <>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleValidate}>Valider</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={handleEdit}>Modifier</button>
          </>
        )}
        {editMode && (
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleSaveEdit}>Enregistrer</button>
        )}
          </div>
    </div>
  );
};