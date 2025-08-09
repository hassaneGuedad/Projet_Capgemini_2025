import React from 'react';
import { Download, Github, Globe, ChevronRight, Zap, X } from 'lucide-react';

interface QuickActionsPanelProps {
  onClose: () => void;
  onDownload: () => void;
  onPreview: () => void;
  onSettings: () => void;
  onShare: () => void;
  onSaveToGitHub: () => void;
  onDeployToNetlify: () => void; // nouvelle prop
}

export function QuickActionsPanel({ onClose, onDownload, onPreview, onSettings, onShare, onSaveToGitHub, onDeployToNetlify }: QuickActionsPanelProps) {
  return (
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white/80 backdrop-blur-md shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      {/* Header */}
      <div className="relative border-b bg-white/60 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-600 ring-1 ring-amber-200">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Actions rapides</h3>
              <p className="text-xs text-gray-500">Accès instantané aux opérations courantes</p>
            </div>
          </div>
          <button onClick={onClose} className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:text-red-500" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {/* Télécharger */}
          <button
            onClick={onDownload}
            className="group w-full flex items-center justify-between gap-3 rounded-xl border bg-white/70 backdrop-blur-sm p-3 hover:shadow-sm hover:border-green-400/50"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 ring-1 ring-green-100">
                <Download className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold">Télécharger le code source</span>
                <span className="block text-xs text-gray-500">Exportez un ZIP de votre projet</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
          </button>

          
          {/* GitHub */}
          <button
            onClick={onSaveToGitHub}
            className="group w-full flex items-center justify-between gap-3 rounded-xl border bg-white/70 backdrop-blur-sm p-3 hover:shadow-sm hover:border-gray-400/50"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white ring-1 ring-gray-800">
                <Github className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold">Sauvegarder sur GitHub</span>
                <span className="block text-xs text-gray-500">Créez un dépôt et poussez le code</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>

          {/* Netlify */}
          <button
            onClick={onDeployToNetlify}
            className="group w-full flex items-center justify-between gap-3 rounded-xl border bg-white/70 backdrop-blur-sm p-3 hover:shadow-sm hover:border-teal-400/50"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                <Globe className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold">Déployer sur Netlify</span>
                <span className="block text-xs text-gray-500">Déploiement instantané</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
          </button>

          
                  </div>
      </div>
    </div>
  );
} 