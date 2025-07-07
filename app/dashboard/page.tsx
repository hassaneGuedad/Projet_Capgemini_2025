'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PlanOverview } from '@/components/PlanOverview';
import { FileList } from '@/components/FileList';
import { UIPreview } from '@/components/UIPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generatePlanFromPrompt, generateProjectFromPrompt, exportProjectAsZip } from '@/lib/utils';
import { Plan, GeneratedFile } from '@/types/agents';
import { ProjectFile } from '@/types';
import { 
  Download,
  Share2,
  Settings,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getUserPlanDrafts, deletePlanDraft } from '@/services/firestore';
import toast from 'react-hot-toast';
import AnthropicProvider from '@/lib/modules/llm/providers/anthropic';

type GenerationStatus = 'idle' | 'generating' | 'completed';

const STATUS: Record<Uppercase<GenerationStatus>, GenerationStatus> = {
  IDLE: 'idle',
  GENERATING: 'generating',
  COMPLETED: 'completed'
} as const;

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>(STATUS.IDLE);
  const [progress, setProgress] = useState(0);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [planValidated, setPlanValidated] = useState(false);
  const [planDrafts, setPlanDrafts] = useState<any[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
    const prompt = localStorage.getItem('currentPrompt');
    if (prompt) {
      setCurrentPrompt(prompt);
      setGenerationStatus(STATUS.GENERATING);
      setProgress(10);
      generatePlanFromPrompt(prompt)
        .then((result) => {
          setPlan(result.plan || result);
          setGenerationStatus(STATUS.IDLE);
          setProgress(50);
        })
        .catch((err) => {
          setError('Erreur lors de la génération du plan.');
          setGenerationStatus(STATUS.IDLE);
        });
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && user.id) {
      getUserPlanDrafts(user.id)
        .then(setPlanDrafts)
        .catch((error) => {
          console.warn('Erreur lors du chargement des brouillons:', error);
          // Ne pas afficher d'erreur à l'utilisateur si c'est juste un problème de connexion
        });
    }
  }, [user]);

  // Charger un plan partagé depuis l'URL
  useEffect(() => {
    const sharedPlan = searchParams.get('sharedPlan');
    if (sharedPlan) {
      try {
        const decodedPlan = JSON.parse(atob(sharedPlan));
        setPlan(decodedPlan.plan);
        setCurrentPrompt(decodedPlan.prompt);
        setPlanValidated(false);
        setFiles([]);
        setProgress(50);
        setGenerationStatus('idle');
        toast.success(`Plan partagé par ${decodedPlan.sharedBy} chargé avec succès !`);
        
        // Nettoyer l'URL
        router.replace('/dashboard');
      } catch (error) {
        toast.error('Erreur lors du chargement du plan partagé.');
      }
    }
  }, [searchParams, router]);

  const mapToProjectFiles = (generatedFiles: GeneratedFile[]): ProjectFile[] => {
    return generatedFiles.map((file, index) => ({
      id: `file-${index}-${Date.now()}`,
      name: file.path.split('/').pop() || `file-${index}`,
      type: getFileType(file.path),
      path: file.path,
      size: formatFileSize(file.content.length),
      lastModified: new Date(),
      description: `Généré le ${new Date().toLocaleString()}`
    }));
  };

  const getFileType = (path: string): 'component' | 'page' | 'api' | 'config' | 'style' => {
    const ext = path.split('.').pop()?.toLowerCase();
    if (['tsx', 'jsx', 'ts', 'js'].includes(ext || '')) {
      return path.includes('components/') ? 'component' : 'page';
    }
    if (['css', 'scss', 'sass', 'less'].includes(ext || '')) return 'style';
    if (path.includes('api/')) return 'api';
    if (['json', 'env', 'config'].includes(ext || '')) return 'config';
    return 'page';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePlanValidated = async () => {
    if (!plan) return;
    setGenerationStatus(STATUS.GENERATING);
    setProgress(70);
    try {
      // Utilisation de la route API Next.js pour interroger Anthropic côté serveur
      const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      const data = await response.json();
      console.log('Réponse Anthropic brute:', data);
      const generated = data.content?.[0]?.text || '';
      setFiles([{ id: 'anthropic-result', name: 'result.txt', type: 'page', path: 'result.txt', size: `${generated.length} B`, lastModified: new Date(), description: `Réponse Anthropic :\n${generated}` }]);
      setGenerationStatus(STATUS.COMPLETED);
      setProgress(100);
      setPlanValidated(true);
      toast.success('Projet généré avec succès !');
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      setError('Erreur lors de la génération du projet : ' + message);
      setGenerationStatus(STATUS.IDLE);
      toast.error('Erreur lors de la génération du projet : ' + message);
    }
  };

  const handleLoadDraft = (draft: any) => {
    setPlan(draft.plan);
    setPlanValidated(false);
    setFiles([]);
    setProgress(50);
    setCurrentPrompt(draft.prompt);
    localStorage.setItem('editedPlan', JSON.stringify(draft.plan));
    localStorage.setItem('currentPrompt', draft.prompt);
    toast.success('Plan chargé avec succès !');
  };

  // Fonction pour supprimer un plan brouillon
  const handleDeleteDraft = async (id: string) => {
    setDraftToDelete(id);
    try {
      await deletePlanDraft(id);
      setPlanDrafts(prev => prev.filter(draft => draft.id !== id));
      toast.success('Brouillon supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du brouillon');
    } finally {
      setDraftToDelete(null);
    }
  };

  // Filtrage, tri et pagination des drafts
  const filteredDrafts = planDrafts
    .filter(d => d.prompt.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDesc
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const paginatedDrafts = filteredDrafts.slice((page - 1) * pageSize, page * pageSize);

  const confirmDeleteDraft = (draftId: string) => setDraftToDelete(draftId);
  const cancelDeleteDraft = () => setDraftToDelete(null);
  const doDeleteDraft = async () => {
    if (draftToDelete) {
      await handleDeleteDraft(draftToDelete);
      setDraftToDelete(null);
    }
  };

  // Fonction pour télécharger le projet
  const handleExportProject = async () => {
    if (!files || files.length === 0) {
      toast.error('Aucun fichier à télécharger. Générez d\'abord le projet.');
      return;
    }
    
    try {
      const projectName = currentPrompt ? currentPrompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-') : 'generated-project';
      await exportProjectAsZip(files, projectName);
      toast.success('Projet téléchargé avec succès !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement du projet.');
    }
  };

  if (isLoading || generationStatus === STATUS.GENERATING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600">{generationStatus === STATUS.GENERATING && !planValidated ? 'Génération du plan en cours...' : 'Génération du projet en cours...'}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (generationStatus) {
      case STATUS.GENERATING:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case STATUS.COMPLETED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = () => {
    switch (generationStatus) {
      case STATUS.GENERATING:
        return 'Génération en cours...';
      case STATUS.COMPLETED:
        return 'Génération terminée';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = () => {
    switch (generationStatus) {
      case STATUS.GENERATING:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case STATUS.COMPLETED:
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Gérez et visualisez vos projets générés par l'IA
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </Button>
              {files.length > 0 && (
                <Button 
                  onClick={handleExportProject}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                <Download className="h-4 w-4" />
                  <span>Télécharger le projet</span>
              </Button>
              )}
            </div>
          </div>

          {/* Project Status */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Statut du projet</h3>
                    <Badge variant="outline" className={getStatusColor()}>
                      {getStatusIcon()}
                      <span className="ml-2">{getStatusLabel()}</span>
                    </Badge>
                  </div>
                  {currentPrompt && (
                    <p className="text-sm text-gray-600 max-w-2xl">
                      <span className="font-medium">Prompt utilisé:</span> {currentPrompt}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Button size="sm" className="flex items-center space-x-2">
                    <Play className="h-3 w-3" />
                    <span>Aperçu</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Plan Overview */}
          <div className="lg:col-span-2 space-y-8">
            {plan && !planValidated && <PlanOverview plan={plan} onAllStepsValidated={handlePlanValidated} />}
            {files.length > 0 && <FileList files={files} />}
            {/* Conseils en bas à gauche */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <span>Conseils</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Testez régulièrement votre application pendant le développement</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Personnalisez les styles selon votre charte graphique</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ajoutez des tests unitaires pour assurer la qualité</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - UI Preview et Actions rapides */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg ml-8">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le code source
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Lancer l'aperçu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier la configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager le projet
                </Button>
              </CardContent>
            </Card>

            {/* Historique des plans brouillons */}
            {user && planDrafts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 ml-8">
                <h2 className="text-lg font-semibold mb-4">Mes plans sauvegardés</h2>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Rechercher un plan..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button onClick={() => setSortDesc(!sortDesc)} className="text-xs underline">
                    {sortDesc ? 'Plus récents' : 'Plus anciens'}
                  </button>
                </div>
                <ul className="space-y-2">
                  {paginatedDrafts.map((draft) => (
                    <li key={draft.id} className="flex flex-col border-b pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-gray-700 truncate">{draft.prompt}</span>
                      <span className="text-xs text-gray-400">{new Date(draft.createdAt).toLocaleString()}</span>
                      <div className="flex gap-2 mt-1">
                        <button
                          className="text-blue-600 hover:underline text-xs self-start"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          Charger ce plan
                        </button>
                        <button
                          className="text-red-600 hover:underline text-xs self-start"
                          onClick={() => confirmDeleteDraft(draft.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-2 items-center">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="text-xs">
                    Page {page} / {Math.max(1, Math.ceil(filteredDrafts.length / pageSize))}
                  </span>
                  <button
                    disabled={page * pageSize >= filteredDrafts.length}
                    onClick={() => setPage(page + 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation avant suppression */}
      {draftToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Voulez-vous vraiment supprimer ce plan&nbsp;?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={doDeleteDraft} className="bg-red-600 text-white px-4 py-2 rounded">Oui, supprimer</button>
              <button onClick={cancelDeleteDraft} className="bg-gray-200 px-4 py-2 rounded">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}