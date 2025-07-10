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
}

export function QuickActionsPanel({ onClose, onDownload, onPreview, onSettings, onShare }: QuickActionsPanelProps) {
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
        <button onClick={onPreview} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">
          <Play className="h-5 w-5" /> Lancer l'aperçu
        </button>
        <button onClick={onSettings} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">
          <Settings className="h-5 w-5" /> Modifier la configuration
        </button>
        <button onClick={onShare} className="w-full flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200">
          <Share2 className="h-5 w-5" /> Partager le projet
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
        />
      )}
    </div>
  );
} 