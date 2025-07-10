import React, { useState, useEffect } from 'react';

interface ChatbotPanelProps {
  selectedFile: any;
  fileCode: string;
  onCodeUpdate: (code: string) => void;
  onClose: () => void;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  setChatHistory: (history: { role: 'user' | 'assistant'; content: string }[]) => void;
}

export function ChatbotPanel({ selectedFile, fileCode, onCodeUpdate, onClose, chatHistory, setChatHistory }: ChatbotPanelProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  // Affichage de l'historique du chat
  useEffect(() => {
    // Optionnel : scroll en bas à chaque nouveau message
    const chatDiv = document.getElementById('chatbot-messages');
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedFile) return;
    setLoading(true);
    setError(null);
    setChatHistory([...chatHistory, { role: 'user', content: input }]);
    try {
      const res = await fetch('/api/chatbot-modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: fileCode,
          instruction: input,
          filename: selectedFile.name,
        }),
      });
      const data = await res.json();
      if (data.modifiedCode) {
        setChatHistory([...chatHistory, { role: 'user', content: input }, { role: 'assistant', content: data.modifiedCode }]);
        setPendingCode(data.modifiedCode); // Met en attente la validation
      } else {
        setError('Aucune modification reçue.');
      }
    } catch (e: any) {
      setError('Erreur lors de la communication avec le chatbot.');
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
            <img src="/img/cap_logo_chatbot.png" alt="Logo Chatbot Capgemini" className="w-8 h-8" />
          </span>
          <h3 className="font-bold text-lg">Chatbot Code Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold px-2" aria-label="Fermer">×</button>
      </div>
      <div id="chatbot-messages" className="flex-1 overflow-y-auto mb-2 space-y-2 p-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-2 py-1 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {error && <div className="text-red-600 text-xs">{error}</div>}
        {/* Validation des changements */}
        {pendingCode && (
          <div className="mt-4">
            <div className="mb-2 font-semibold">Valider les changements proposés&nbsp;?</div>
            <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-60 mb-2">{pendingCode}</pre>
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  onCodeUpdate(pendingCode);
                  setPendingCode(null);
                }}
              >
                Valider les changements
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setPendingCode(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2 p-4 border-t">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Demandez une modification du code..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-blue-600 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default ChatbotPanel; 