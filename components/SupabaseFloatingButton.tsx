import React from 'react';
import { Database } from 'lucide-react';

export function SupabaseFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-64 right-6 z-50 bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center border border-gray-200 hover:shadow-xl transition"
      style={{ padding: 0 }}
      aria-label="Ouvrir l'intégration Supabase"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
        <Database className="w-10 h-10 text-green-600" />
      </span>
    </button>
  );
} 