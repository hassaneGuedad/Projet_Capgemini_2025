import React, { useState } from 'react';

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
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Mes plans sauvegardés</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold px-2" aria-label="Fermer">×</button>
      </div>
      {/* Barre de recherche */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Rechercher un plan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full text-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPlans.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">Aucun plan sauvegardé.</div>
        ) : (
          <ul className="space-y-4">
            {filteredPlans.map((draft: Draft) => (
              <li key={draft.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                <span className="text-sm text-gray-700 truncate">{draft.prompt}</span>
                <span className="text-xs text-gray-400 block">{new Date(draft.createdAt).toLocaleString()}</span>
                <div className="flex gap-2 mt-1">
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={() => onLoad(draft)}
                  >
                    Charger ce plan
                  </button>
                  <button
                    className="text-red-600 hover:underline text-xs"
                    onClick={() => onDelete(draft.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 