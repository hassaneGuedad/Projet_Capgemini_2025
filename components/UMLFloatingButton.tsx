import React from 'react';
import { BarChart3 } from 'lucide-react';

export function UMLFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-96 right-6 z-50 bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center border border-gray-200 hover:shadow-xl transition"
      style={{ padding: 0 }}
      aria-label="Ouvrir le générateur UML"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
        <BarChart3 className="w-10 h-10 text-purple-600" />
      </span>
    </button>
  );
} 