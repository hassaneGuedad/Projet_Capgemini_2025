'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Clock,
  Clipboard,
  Folder,
  ChevronDown,
  ChevronUp,
  Database,
  BarChart3
} from 'lucide-react';
import { getUserPlanDrafts, deletePlanDraft, savePlanDraft } from '@/services/firestore';
import toast from 'react-hot-toast';
import DeepseekProvider from '@/lib/modules/llm/providers/deepseek';
import { CodeEditor } from '@/components/CodeEditor';
import { MonacoCodeEditor } from '@/components/MonacoCodeEditor';
import { FileExplorer } from '@/components/FileExplorer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChatbotPanel } from '@/components/ChatbotPanel';
import { ChatbotFloatingButton } from '@/components/ChatbotFloatingButton';
import { SavedPlansFloatingButton } from '@/components/SavedPlansFloatingButton';
import { SavedPlansPanel } from '@/components/SavedPlansPanel';
import { QuickActionsFloatingButton } from '@/components/QuickActionsFloatingButton';
import { QuickActionsPanel } from '@/components/QuickActionsPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import sdk from '@stackblitz/sdk';
import { SupabaseFloatingButton } from '@/components/SupabaseFloatingButton';
import { UMLFloatingButton } from '@/components/UMLFloatingButton';
import { UMLPanel } from '@/components/UMLPanel';
import { AuthorizedEmailsFloatingButton } from '@/components/AuthorizedEmailsFloatingButton';
import { AuthorizedEmailsPanel } from '@/components/AuthorizedEmailsPanel';



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
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [editorCode, setEditorCode] = useState<string>('');
  const [fileCode, setFileCode] = useState<string>('');
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  // Onglets ouverts (multi-fichiers)
  const [openTabs, setOpenTabs] = useState<ProjectFile[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  // Dialogue de confirmation suppression
  const [deleteConfirm, setDeleteConfirm] = useState<{file: ProjectFile | null, open: boolean}>({file: null, open: false});
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isPlansPanelOpen, setIsPlansPanelOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isSupabasePanelOpen, setIsSupabasePanelOpen] = useState(false);
  const [isUMLPanelOpen, setIsUMLPanelOpen] = useState(false);
  const [isAuthorizedEmailsPanelOpen, setIsAuthorizedEmailsPanelOpen] = useState(false);
  
  // Vérifier si l'utilisateur peut accéder au panel d'administration
  const canAccessAdminPanel = user?.email === 'scapworkspace@gmail.com';


  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [githubRepoName, setGithubRepoName] = useState('');
  const [githubRepoPrivate, setGithubRepoPrivate] = useState(true);
  const [githubToken, setGithubToken] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubResult, setGithubResult] = useState<string|null>(null);
  const [githubError, setGithubError] = useState<string|null>(null);
  const [isNetlifyModalOpen, setIsNetlifyModalOpen] = useState(false);
  const [netlifyToken, setNetlifyToken] = useState('');
  const [netlifyLoading, setNetlifyLoading] = useState(false);
  const [netlifyResult, setNetlifyResult] = useState<string|null>(null);
  const [netlifyError, setNetlifyError] = useState<string|null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  // --- GESTION HISTORIQUE CHAT PAR PROJET ---
  // Utilitaire pour générer une clé unique d'historique (id de plan ou hash du prompt)
  function getChatHistoryKey(planId: string | null): string {
    return planId ? `chatHistory_${planId}` : 'chatHistory_default';
  }
  const chatHistoryKey = useMemo(() => getChatHistoryKey(currentPlanId), [currentPlanId]);
  useEffect(() => {
    const saved = localStorage.getItem(chatHistoryKey);
    setChatHistory(saved ? JSON.parse(saved) : []);
    // eslint-disable-next-line
  }, [chatHistoryKey]);
  useEffect(() => {
    localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
    // eslint-disable-next-line
  }, [chatHistory, chatHistoryKey]);
  // --- FIN GESTION HISTORIQUE ---

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
          const newPlanId = (result.plan && result.plan.id) || (result.id) || (result.planId) || (result.plan && result.plan._id) || null;
          setCurrentPlanId(newPlanId || hashPrompt(prompt));
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
        const sharedPlanId = (decodedPlan.plan && decodedPlan.plan.id) || (decodedPlan.id) || (decodedPlan.planId) || (decodedPlan.plan && decodedPlan.plan._id) || null;
        setCurrentPlanId(sharedPlanId || hashPrompt(decodedPlan.prompt));
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

  useEffect(() => {
    if (files.length > 0) {
      setEditorCode(files[0].description || '');
    }
  }, [files]);

  useEffect(() => {
    if (selectedFile && selectedFile.description !== fileCode) {
      setFileCode(selectedFile.description ?? '');
    }
  }, [selectedFile]);

  // Synchronisation de l'onglet actif avec selectedFile et fileCode
  useEffect(() => {
    if (!activeTab) return;
    // Si déjà synchronisé, ne rien faire
    if (selectedFile?.id === activeTab) return;
    const file = openTabs.find(f => f.id === activeTab);
    if (file) {
      setSelectedFile(file);
      setFileCode(file.description ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Lors du chargement d'un plan, restaurer le contenu modifié si présent
  useEffect(() => {
    if (plan && files.length > 0 && currentPlanId) {
      setFiles(prevFiles => prevFiles.map(f => {
        const saved = localStorage.getItem(getFileStorageKey(currentPlanId, f.path));
        return saved ? { ...f, description: saved } : f;
      }));
    }
    // eslint-disable-next-line
  }, [plan, currentPlanId]);

  // Sauvegarde manuelle
  const handleSave = () => {
    if (selectedFile && currentPlanId) {
      localStorage.setItem(getFileStorageKey(currentPlanId, selectedFile.path), fileCode);
      setFiles(prev =>
        prev.map(f =>
          f.id === selectedFile.id
            ? { ...f, description: fileCode }
            : f
        )
      );
      toast.success('Fichier sauvegardé !');
    }
  };

  // Sauvegarde auto toutes les 5s si code modifié
  useEffect(() => {
    if (!selectedFile || !currentPlanId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem(getFileStorageKey(currentPlanId, selectedFile.path), fileCode);
      setFiles(prev =>
        prev.map(f =>
          f.id === selectedFile.id
            ? { ...f, description: fileCode }
            : f
        )
      );
      toast.success('Sauvegarde automatique !');
    }, 5000);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [fileCode, selectedFile, currentPlanId]);

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
      // Utilisation de la route API Next.js pour interroger DeepSeek côté serveur
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      const data = await response.json();
      console.log('Réponse DeepSeek brute:', data);
      const generated = data.content?.[0]?.text || '';
      // Découper la réponse DeepSeek en plusieurs fichiers, toutes extensions
      const fileBlocks = generated.split(/===\s*([^\s=]+?\.[a-zA-Z0-9]+)\s*===/g).filter(Boolean);
      const filesArray = [];
      for (let i = 0; i < fileBlocks.length; i += 2) {
        const name = fileBlocks[i].trim();
        let content = (fileBlocks[i + 1] || '').trim();
        // Nettoyer le code : retirer les balises ``` éventuelles et les lignes vides
        content = content.replace(/^```[a-zA-Z]*\s*|```$/gm, '').trim();
        filesArray.push({
          id: name,
          name,
          type: getFileType(name),
          path: name,
          size: `${content.length} B`,
          lastModified: new Date(),
          description: content,
        });
      }
      setFiles(filesArray);
      setGenerationStatus(STATUS.COMPLETED);
      setProgress(100);
      setPlanValidated(true);
      toast.success('Projet généré avec succès !');
      if (plan && !(plan as any).id) {
        const generatedId = `plan_${Date.now()}`;
        (plan as any).id = generatedId;
        setCurrentPlanId(generatedId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      setError('Erreur lors de la génération du projet : ' + message);
      setGenerationStatus(STATUS.IDLE);
      toast.error('Erreur lors de la génération du projet : ' + message);
    }
  };

  const handleLoadDraft = (draft: any) => {
    setPlan(draft.plan);
    setCurrentPlanId(draft.id || hashPrompt(draft.prompt)); // <-- stocke l'id du draft
    setPlanValidated(false);
    setFiles(draft.files || []);
    setProgress(50);
    setCurrentPrompt(draft.prompt);
    setChatHistory(draft.chatHistory || []); // <-- ici
    localStorage.setItem('editedPlan', JSON.stringify(draft.plan));
    localStorage.setItem('currentPrompt', draft.prompt);
    toast.success('Plan chargé avec succès !', { duration: 1000 });
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

  // Gestion création, suppression, renommage fichiers
  const handleCreateFile = (name: string) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name,
      path: name,
      type: 'page', // <-- le type correspond bien à l'union
      size: '0 B',
      lastModified: new Date(),
      description: '',
    };
    if (currentPlanId) {
      localStorage.setItem(getFileStorageKey(currentPlanId, name), '');
    }
    setFiles(prev => [...prev, newFile]);
  };
  const handleCreateFolder = (name: string) => {
    setFiles(prev => [
      ...prev,
      {
        id: `folder-${Date.now()}`,
        name,
        path: name.endsWith('/') ? name : name + '/',
        type: 'folder',
        size: '',
        lastModified: new Date(),
        description: '',
      }
    ]);
  };
  const handleRenameFile = (file: ProjectFile, newName: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id
          ? { ...f, name: newName, path: newName }
          : f
      )
    );
  };
  // Sélectionner un fichier (ouvre un onglet si pas déjà ouvert)
  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFile(file);
    setFileCode(file.description ?? '');
    if (!openTabs.find(f => f.id === file.id)) {
      setOpenTabs(tabs => [...tabs, file]);
    }
    if (activeTab !== file.id) {
      setActiveTab(file.id);
    }
  };
  // Fermer un onglet
  const handleCloseTab = (fileId: string) => {
    setOpenTabs(tabs => tabs.filter(f => f.id !== fileId));
    if (activeTab === fileId) {
      // Si on ferme l'onglet actif, activer le précédent ou le suivant
      const idx = openTabs.findIndex(f => f.id === fileId);
      const next = openTabs[idx + 1] || openTabs[idx - 1] || null;
      setActiveTab(next ? next.id : null);
      setSelectedFile(next || null);
      setFileCode(next?.description ?? '');
    }
  };
  // Confirmation suppression
  const handleDeleteFile = (file: ProjectFile) => {
    setDeleteConfirm({file, open: true});
  };
  const confirmDelete = () => {
    if (deleteConfirm.file) {
      setFiles(prev => prev.filter(f => f.id !== deleteConfirm.file!.id));
      setOpenTabs(tabs => tabs.filter(f => f.id !== deleteConfirm.file!.id));
      if (selectedFile?.id === deleteConfirm.file.id) setSelectedFile(null);
    }
    setDeleteConfirm({file: null, open: false});
  };
  const cancelDelete = () => setDeleteConfirm({file: null, open: false});

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

  const isHtmlFile = selectedFile && selectedFile.name.endsWith('.html');
  const isReactFile = selectedFile && (selectedFile.name.endsWith('.jsx') || selectedFile.name.endsWith('.tsx') || (selectedFile.name.endsWith('.js') && fileCode.includes('React')));

  function getLivePreviewSrcDoc() {
    if (isHtmlFile) {
      return fileCode;
    }
    if (isReactFile) {
      // Sanitize code: remove import/export
      const sanitizedCode = fileCode
        .replace(/^export default /gm, '')
        .replace(/^import .*/gm, '')
        .replace(/^export .*/gm, '');
      // Ajout d'un wrapper pour capturer les erreurs
      return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>body { font-family: sans-serif; padding: 1rem; }</style>
  </head>
  <body>
    <div id="root"></div>
    <div id="preview-error" style="color: red; font-weight: bold; margin-top: 1em;"></div>
    <script type="text/babel">
      try {
        ${sanitizedCode}
        let rootComponent = typeof App !== 'undefined' ? <App /> : (typeof exports !== 'undefined' && exports.default ? exports.default : null);
        if (rootComponent) {
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(rootComponent);
        } else {
          document.getElementById('preview-error').textContent = 'Aucun composant App trouvé.';
        }
      } catch (e) {
        document.getElementById('preview-error').textContent = 'Erreur dans la preview : ' + e.message;
      }
    </script>
  </body>
</html>`;
    }
    return '';
  }

  const handleSavePlan = async () => {
    if (!user) return;
    try {
      await savePlanDraft({ userId: user.id, prompt: currentPrompt, plan, files, chatHistory });
      toast.success('Plan sauvegardé dans vos brouillons !');
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde du plan.');
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
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </Button>
              {files.length > 0 && (
                <>
                  <Button 
                    onClick={handleExportProject}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Télécharger le projet</span>
                  </Button>
                  <Button
                    onClick={() => {
                      // Préparer les fichiers pour StackBlitz
                      const stackblitzFiles = files.reduce((acc, f) => {
                        acc[f.path] = f.description || '';
                        return acc;
                      }, {} as Record<string, string>);
                      // Ajouter un package.json minimal si absent
                      if (!stackblitzFiles['package.json']) {
                        stackblitzFiles['package.json'] = JSON.stringify({
                          name: 'capworkspace-project',
                          version: '1.0.0',
                          main: 'index.js',
                          scripts: { start: 'node index.js' },
                          dependencies: {}
                        }, null, 2);
                      }
                      sdk.openProject({
                        files: stackblitzFiles,
                        title: 'Projet CapWorkSpace',
                        description: 'Projet généré avec CapWorkSpace',
                        template: 'node', // ou 'javascript', 'create-react-app', etc. selon le projet
                      });
                    }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4"><path d="M16 0l-2.219 2.219 2.219 2.219 2.219-2.219zM2.219 2.219l-2.219 2.219 2.219 2.219 2.219-2.219zM29.781 2.219l-2.219 2.219 2.219 2.219 2.219-2.219zM16 4.438l-11.563 11.563 2.219 2.219 9.344-9.344 9.344 9.344 2.219-2.219zM0 16l2.219 2.219 2.219-2.219-2.219-2.219zM29.781 13.781l-2.219 2.219 2.219 2.219 2.219-2.219zM16 27.563l-2.219 2.219 2.219 2.219 2.219-2.219zM2.219 29.781l-2.219 2.219 2.219 2.219 2.219-2.219zM29.781 29.781l-2.219 2.219 2.219 2.219 2.219-2.219z"/></svg>
                    <span>Lancer dans StackBlitz</span>
                  </Button>
                </>
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
                    <div className="text-sm text-gray-600 max-w-2xl flex items-start gap-2">
                      <span className="font-medium">Prompt utilisé:</span>
                      <span>
                        {currentPrompt.length > 200 && !showFullPrompt
                          ? currentPrompt.slice(0, 200) + '...'
                          : currentPrompt}
                      </span>
                      {currentPrompt.length > 200 && (
                        <button
                          onClick={() => setShowFullPrompt(v => !v)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                          aria-label={showFullPrompt ? 'Masquer le prompt' : 'Afficher tout le prompt'}
                        >
                          {showFullPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Left Column - Plan Overview et éditeur élargi */}
          <div className="lg:col-span-7 space-y-8">
            {plan && !planValidated && (
              <PlanOverview 
                plan={plan} 
                onAllStepsValidated={handlePlanValidated}
                showValidateButton={!planDrafts.some(d => d.id === currentPlanId)}
              />
            )}
            {files.length > 0 && (
              <div className="flex">
                <div className="w-64 flex-shrink-0">
                  <FileExplorer
                    files={files}
                    onSelectFile={handleSelectFile}
                    selectedFile={selectedFile}
                    onRenameFile={handleRenameFile}
                    onDeleteFile={handleDeleteFile}
                    onCreateFile={handleCreateFile}
                    onCreateFolder={handleCreateFolder}
                  />
                </div>
                <div className="flex-1 ml-24">
                  {selectedFile && (
                    <div className={planDrafts.some(d => d.id === currentPlanId) ? "mt-12" : "mt-6"}>
                      <div className="flex items-center mb-2">
                        <h3 className="font-bold mr-4">{selectedFile.name}</h3>
                        <button
                          className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm ml-auto"
                          onClick={async () => {
                            await navigator.clipboard.writeText(fileCode);
                          }}
                        >
                          <Clipboard className="w-4 h-4 mr-1" /> Copier
                        </button>
                        <Button
                          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleSavePlan}
                        >
                          Sauvegarder ce plan
                        </Button>
                      </div>
                      <MonacoCodeEditor
                        value={fileCode}
                        onChange={setFileCode}
                        language={selectedFile.name.endsWith('.js') || selectedFile.name.endsWith('.jsx') || selectedFile.name.endsWith('.tsx') ? 'javascript' : 'html'}
                        height="600px"
                      />
                      {/* Notice preview React */}
                      {selectedFile.name.endsWith('.js') || selectedFile.name.endsWith('.jsx') || selectedFile.name.endsWith('.tsx') ? (
                        <div className="text-xs text-gray-600 mb-2">
                          <b>Note :</b> Pour la prévisualisation React, tous les composants doivent être définis dans le même fichier, sans import/export. Le composant d'entrée doit s'appeler <code>App</code>.
                        </div>
                      ) : null}
                      {/* Preview + gestion erreur */}
                      <div className="border rounded-lg overflow-hidden bg-white shadow">
                        {(selectedFile.name.endsWith('.html') || selectedFile.name.endsWith('.js') || selectedFile.name.endsWith('.jsx') || selectedFile.name.endsWith('.tsx')) ? (
                          <>
                            <iframe
                              srcDoc={getLivePreviewSrcDoc()}
                              title="Live Preview"
                              sandbox="allow-scripts allow-same-origin"
                              style={{ width: '100%', height: 400, border: 'none' }}
                            />
                            {/* Affichage de l'erreur de preview si présente */}
                            {previewError && (
                              <div className="text-red-600 text-xs mt-2">{previewError}</div>
                            )}
                          </>
                        ) : (
                          <div className="p-8 text-gray-400 text-center">Aucune prévisualisation disponible pour ce type de fichier.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            {/* Historique des plans brouillons */}
            {/* (SUPPRIMER tout ce bloc) */}
            {/* {user && planDrafts.length > 0 && (
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
            )} */}
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
      {/* Dialogue de confirmation suppression */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
            <h3 className="font-bold text-lg mb-4">Confirmer la suppression</h3>
            <p>Voulez-vous vraiment supprimer <b>{deleteConfirm.file?.name}</b> ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={cancelDelete}>Annuler</button>
              <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
      {isChatbotOpen && (
        <div>
          <button
            className="absolute top-4 right-80 z-50 bg-gray-200 hover:bg-red-200 text-gray-700 px-3 py-1 rounded text-xs"
            onClick={() => setChatHistory([])}
          >
            Réinitialiser l'historique du chat
          </button>
          <ChatbotPanel
            selectedFile={selectedFile}
            fileCode={fileCode}
            onCodeUpdate={setFileCode}
            onClose={() => setIsChatbotOpen(false)}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>
      )}
      {/* Bouton flottant et Chatbot latéral */}
      {!isChatbotOpen && !isPlansPanelOpen && !isQuickActionsOpen && !isSupabasePanelOpen && (
        <ChatbotFloatingButton onClick={() => setIsChatbotOpen(true)} />
      )}
      {!isPlansPanelOpen && !isChatbotOpen && !isQuickActionsOpen && !isSupabasePanelOpen && (
        <SavedPlansFloatingButton onClick={() => setIsPlansPanelOpen(true)} />
      )}
      {!isQuickActionsOpen && !isChatbotOpen && !isPlansPanelOpen && !isSupabasePanelOpen && (
        <QuickActionsFloatingButton onClick={() => setIsQuickActionsOpen(true)} />
      )}
      {/* Ajout du bouton Supabase */}
      {!isSupabasePanelOpen && !isChatbotOpen && !isPlansPanelOpen && !isQuickActionsOpen && !isUMLPanelOpen && (
        <SupabaseFloatingButton onClick={() => setIsSupabasePanelOpen(true)} />
      )}
      {/* Ajout du bouton UML */}
      {!isUMLPanelOpen && !isChatbotOpen && !isPlansPanelOpen && !isQuickActionsOpen && !isSupabasePanelOpen && !isAuthorizedEmailsPanelOpen && (
        <UMLFloatingButton onClick={() => setIsUMLPanelOpen(true)} />
      )}
      {/* Ajout du bouton Emails Autorisés - Visible uniquement pour l'admin */}
      {canAccessAdminPanel && !isUMLPanelOpen && !isChatbotOpen && !isPlansPanelOpen && !isQuickActionsOpen && !isSupabasePanelOpen && !isAuthorizedEmailsPanelOpen && (
        <AuthorizedEmailsFloatingButton onClick={() => setIsAuthorizedEmailsPanelOpen(true)} />
      )}
      {/* Panneau latéral Supabase */}
      {isSupabasePanelOpen && (
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-green-100 h-10 w-10">
                <Database className="h-6 w-6 text-green-600" />
              </span>
              <span className="text-lg font-bold text-green-700">Intégration Supabase</span>
            </div>
            <button onClick={() => setIsSupabasePanelOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="text-gray-700 text-sm mb-4">
              Pour connecter votre projet à Supabase&nbsp;:
              <ol className="list-decimal ml-6 mt-2 space-y-1">
                <li>Cliquez sur <b>Connecter à Supabase</b> pour ouvrir votre espace Supabase et sélectionner un projet existant.</li>
                <li>Ou cliquez sur <b>Créer un projet Supabase</b> pour en créer un nouveau dans votre organisation.</li>
                <li>Copiez l’URL et la clé API de votre projet Supabase, puis ajoutez-les dans votre fichier <code>.env</code> ou dans la configuration du projet généré.</li>
              </ol>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => window.open('https://app.supabase.com/', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Connecter à Supabase
              </Button>
              <Button
                onClick={() => window.open('https://app.supabase.com/project/new', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Créer un projet Supabase
              </Button>
            </div>
          </div>
        </div>
      )}
      {isPlansPanelOpen && (
        <SavedPlansPanel
          plans={planDrafts}
          onLoad={handleLoadDraft}
          onDelete={handleDeleteDraft}
          onClose={() => setIsPlansPanelOpen(false)}
        />
      )}
      {isQuickActionsOpen && (
        <QuickActionsPanel
          onClose={() => setIsQuickActionsOpen(false)}
          onDownload={handleExportProject}
          onPreview={() => { /* Ajoute ici la logique d'aperçu */ }}
          onSettings={() => { /* Ajoute ici la logique de config */ }}
          onShare={() => { /* Ajoute ici la logique de partage */ }}
          onSaveToGitHub={() => {
            setGithubRepoName('mon-projet');
            setIsGitHubModalOpen(true);
          }}
          onDeployToNetlify={() => {
            setIsNetlifyModalOpen(true);
          }}
        />
      )}
      {/* Panneau latéral UML */}
      {isUMLPanelOpen && (
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-purple-100 h-10 w-10">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </span>
              <span className="text-lg font-bold text-purple-700">Générateur UML</span>
            </div>
            <button onClick={() => setIsUMLPanelOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <UMLPanel files={files} />
          </div>
        </div>
      )}
      {/* Panel des Emails Autorisés - Accessible uniquement pour l'admin */}
      {isAuthorizedEmailsPanelOpen && canAccessAdminPanel && (
        <AuthorizedEmailsPanel 
          isOpen={isAuthorizedEmailsPanelOpen}
          onClose={() => setIsAuthorizedEmailsPanelOpen(false)}
        />
      )}


      <Dialog open={isGitHubModalOpen} onOpenChange={setIsGitHubModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarder sur GitHub</DialogTitle>
            <DialogDescription>
              Crée un dépôt GitHub et pousse les fichiers générés.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setGithubLoading(true);
              setGithubError(null);
              setGithubResult(null);
              try {
                const res = await fetch('/api/github/create-repo', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    repoName: githubRepoName,
                    isPrivate: githubRepoPrivate,
                    token: githubToken,
                    files,
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setGithubResult(data.url);
                } else {
                  setGithubError(data.error || 'Erreur inconnue');
                }
              } catch (err: any) {
                setGithubError(err.message || 'Erreur inconnue');
              } finally {
                setGithubLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Nom du dépôt</label>
              <input type="text" value={githubRepoName} onChange={e => setGithubRepoName(e.target.value)} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Visibilité</label>
              <select value={githubRepoPrivate ? 'private' : 'public'} onChange={e => setGithubRepoPrivate(e.target.value === 'private')} className="w-full border rounded px-2 py-1">
                <option value="public">Public</option>
                <option value="private">Privé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Token GitHub (scope repo)</label>
              <input type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)} className="w-full border rounded px-2 py-1" required />
              <span className="text-xs text-muted-foreground">Génère un token sur https://github.com/settings/tokens (scope repo)</span>
            </div>
            {githubError && <div className="text-red-500 text-sm">{githubError}</div>}
            {githubResult && <div className="text-green-600 text-sm">Dépôt créé : <a href={githubResult} target="_blank" rel="noopener noreferrer" className="underline">{githubResult}</a></div>}
            <DialogFooter>
              <Button type="submit" disabled={githubLoading}>{githubLoading ? 'Envoi...' : 'Créer et pousser'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isNetlifyModalOpen} onOpenChange={setIsNetlifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déployer sur Netlify</DialogTitle>
            <DialogDescription>
              Déploie instantanément ce projet sur Netlify. Un token personnel Netlify est requis.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setNetlifyLoading(true);
              setNetlifyError(null);
              setNetlifyResult(null);
              try {
                const res = await fetch('/api/netlify/deploy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    token: netlifyToken,
                    files,
                  }),
                });
                let data: any = null;
                let text = await res.text();
                try {
                  data = text ? JSON.parse(text) : {};
                } catch (e) {
                  data = { error: 'Réponse du serveur non valide.' };
                }
                console.log('Réponse Netlify:', data);
                if (res.ok && !data.error) {
                  // Affiche le lien du site si possible
                  if (data.site && data.site.admin_url) {
                    setNetlifyResult(data.site.admin_url);
                  } else if (data.deploy && data.deploy.admin_url) {
                    setNetlifyResult(data.deploy.admin_url);
                  } else {
                    setNetlifyResult('Déploiement réussi, mais aucun lien fourni.');
                  }
                } else {
                  setNetlifyError(data.error || data.message || `Erreur HTTP ${res.status}`);
                }
              } catch (err: any) {
                setNetlifyError(err.message || 'Erreur inconnue');
              } finally {
                setNetlifyLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Token Netlify personnel</label>
              <input type="password" value={netlifyToken} onChange={e => setNetlifyToken(e.target.value)} className="w-full border rounded px-2 py-1" required />
              <span className="text-xs text-muted-foreground">Génère un token sur https://app.netlify.com/user/applications/personal</span>
            </div>
            {netlifyError && <div className="text-red-500 text-sm">{netlifyError}</div>}
            {netlifyResult && <div className="text-green-600 text-sm">Site déployé : <a href={netlifyResult} target="_blank" rel="noopener noreferrer" className="underline">{netlifyResult}</a></div>}
            <DialogFooter>
              <Button type="submit" disabled={netlifyLoading}>{netlifyLoading ? 'Déploiement...' : 'Déployer'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Ajoute la fonction utilitaire hashPrompt (simple hash du prompt)
function hashPrompt(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

// Utilitaire pour la clé de stockage par plan et fichier
function getFileStorageKey(planId: string | null, filePath: string) {
  return `file_${planId || 'default'}_${filePath}`;
}