import React from 'react';
import { Zap } from 'lucide-react';

export function QuickActionsFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-44 right-6 z-50 bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center border border-gray-200 hover:shadow-xl transition"
      style={{ padding: 0 }}
      aria-label="Ouvrir les actions rapides"
    >
      <Zap className="w-10 h-10 text-yellow-500" />
    </button>
  );
} 