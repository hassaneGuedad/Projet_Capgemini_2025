import React from 'react';

export function ChatbotFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center border border-gray-200 hover:shadow-xl transition"
      style={{ padding: 0 }}
      aria-label="Ouvrir le chatbot"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
        <img src="/img/cap_logo_chatbot.png" alt="Chatbot" className="w-10 h-10 object-contain rounded-full" />
      </span>
    </button>
  );
}
