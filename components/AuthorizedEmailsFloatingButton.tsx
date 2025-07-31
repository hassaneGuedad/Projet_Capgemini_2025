'use client';

import React from 'react';
import { Button } from './ui/button';
import { Shield } from 'lucide-react';

interface AuthorizedEmailsFloatingButtonProps {
  onClick: () => void;
}

export function AuthorizedEmailsFloatingButton({ onClick }: AuthorizedEmailsFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-44 right-6 w-14 h-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white z-40 transition-all duration-200 hover:scale-110"
      title="Gestion des Emails Autorisés"
    >
      <Shield className="w-6 h-6" />
    </Button>
  );
} 