import React, { useState } from 'react';
import { Bookmark, Search, FileText, Calendar, Trash2, FolderOpen, X } from 'lucide-react';

interface Draft {
  id: string;
  prompt: string;
  createdAt: string | number | Date;
}

interface SavedPlansPanelProps {
  plans: Draft[];
  onLoad: (draft: Draft) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function SavedPlansPanel({ plans, onLoad, onDelete, onClose }: SavedPlansPanelProps) {
  const [search, setSearch] = useState('');
  const filteredPlans = plans.filter(draft =>
    draft.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white/80 backdrop-blur-md shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 ring-1 ring-indigo-200">
            <Bookmark className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-extrabold text-base tracking-tight">Mes plans sauvegardés</h3>
            <p className="text-xs text-gray-500">{plans.length} plan{plans.length > 1 ? 's' : ''} au total</p>
          </div>
        </div>
        <button onClick={onClose} className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:text-red-500" aria-label="Fermer">
          <X className="h-5 w-5" />
        </button>
      </div>
      {/* Barre de recherche */}
      <div className="p-4 border-b bg-white/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un plan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-2xl pl-9 pr-8 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPlans.length === 0 ? (
          <div className="text-gray-500 text-center mt-16">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-2">
              <FolderOpen className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-sm">Aucun plan sauvegardé</div>
            <div className="text-xs text-gray-400">Générez un plan puis sauvegardez-le</div>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredPlans.map((draft: Draft) => (
              <li key={draft.id}>
                <div className="group rounded-xl border bg-white/70 backdrop-blur-sm p-3 hover:shadow-sm hover:border-blue-400/40 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(draft.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-900 truncate">
                        {draft.prompt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs border border-blue-200 rounded-md px-2 py-1"
                        onClick={() => onLoad(draft)}
                      >
                        Charger
                      </button>
                      <button
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(draft.id)}
                        aria-label="Supprimer"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 