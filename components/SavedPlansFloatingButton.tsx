import React from 'react';
import { Folder } from 'lucide-react';

export function SavedPlansFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-50 bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center border border-gray-200 hover:shadow-xl transition"
      style={{ padding: 0 }}
      aria-label="Ouvrir mes plans sauvegardés"
    >
      <Folder className="w-10 h-10 text-blue-600" />
    </button>
  );
}
