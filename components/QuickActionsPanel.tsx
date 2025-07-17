import React from 'react';
import { Download, Play, Settings, Share2 } from 'lucide-react';
import { QuickActionsFloatingButton } from '@/components/QuickActionsFloatingButton';
import { useState } from 'react';

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
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  return (
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Actions rapides</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold px-2" aria-label="Fermer">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <button onClick={onDownload} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700">
          <Download className="h-5 w-5" /> Télécharger le code source
        </button>
        <button onClick={onShare} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200">
          <Share2 className="h-5 w-5" /> Partager le projet
        </button>
        <button onClick={onSaveToGitHub} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
          Sauvegarder sur GitHub
        </button>
        <button onClick={onDeployToNetlify} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#00ad9f] text-white font-semibold hover:bg-[#009688]">
          <svg viewBox="0 0 32 32" fill="currentColor" className="h-5 w-5"><path d="M16 0l-2.219 2.219 2.219 2.219 2.219-2.219zM2.219 2.219l-2.219 2.219 2.219 2.219 2.219-2.219zM29.781 2.219l-2.219 2.219 2.219 2.219 2.219-2.219zM16 4.438l-11.563 11.563 2.219 2.219 9.344-9.344 9.344 9.344 2.219-2.219zM0 16l2.219 2.219 2.219-2.219-2.219-2.219zM29.781 13.781l-2.219 2.219 2.219 2.219 2.219-2.219zM16 27.563l-2.219 2.219 2.219 2.219 2.219-2.219zM2.219 29.781l-2.219 2.219 2.219 2.219 2.219-2.219zM29.781 29.781l-2.219 2.219 2.219 2.219 2.219-2.219z"/></svg>
          Déployer sur Netlify
        </button>
      </div>
      {!isQuickActionsOpen && (
        <QuickActionsFloatingButton onClick={() => setIsQuickActionsOpen(true)} />
      )}
      {isQuickActionsOpen && (
        <QuickActionsPanel
          onClose={() => setIsQuickActionsOpen(false)}
          onDownload={onDownload}
          onPreview={onPreview}
          onSettings={onSettings}
          onShare={onShare}
          onSaveToGitHub={onSaveToGitHub}
          onDeployToNetlify={onDeployToNetlify}
        />
      )}
    </div>
  );
} 