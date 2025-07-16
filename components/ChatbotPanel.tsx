import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotPanelProps {
  selectedFile: any;
  fileCode: string;
  onCodeUpdate: (code: string) => void;
  onClose: () => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  files?: { name: string; content: string }[]; // optionnel, tous les fichiers du projet
}

export function ChatbotPanel({ selectedFile, fileCode, onCodeUpdate, onClose, chatHistory, setChatHistory, files }: ChatbotPanelProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);

  // Affichage de l'historique du chat
  useEffect(() => {
    // Optionnel : scroll en bas à chaque nouveau message
    const chatDiv = document.getElementById('chatbot-messages');
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    // Détection commande /search
    if (input.trim().toLowerCase().startsWith('/search')) {
      const query = input.replace(/^\/search/i, '').trim();
      if (!query) {
        setError('Veuillez préciser un mot-clé à rechercher.');
        setLoading(false);
        return;
      }
      setChatHistory(prev => [...prev, { role: 'user', content: input }]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Recherche en cours...' }]);
      try {
        // Prépare la liste des fichiers à envoyer
        let filesToSend = files;
        if (!filesToSend && selectedFile) {
          // fallback : fichier courant seulement
          filesToSend = [{ name: selectedFile.name, content: fileCode }];
        }
        const res = await fetch('/api/code-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, files: filesToSend }),
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const formatted = data.results.map((r: { file: string; snippet: string; startLine: number }) =>
            `Fichier : ${r.file} (ligne ${r.startLine})\n\n\`\`\`javascript\n${r.snippet}\n\`\`\`\n`
          ).join('\n\n');
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: formatted }
          ]);
        } else {
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: 'Aucun résultat trouvé.' }
          ]);
        }
      } catch (e: any) {
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: 'Erreur lors de la recherche.' }
        ]);
      }
      setInput('');
      setLoading(false);
      setPendingCode(null); // Réinitialise après une recherche
      // SÉCURITÉ : ne jamais appeler setPendingCode(...) dans la branche /search
      return;
    }
    // Détection demande d'explication de fichier
    const explainRegex = /(?:explique moi le code de fichier|explain file)\s+([\w.-]+)/i;
    const explainMatch = input.match(explainRegex);
    if (explainMatch) {
      let filename = explainMatch[1];
      let fileToExplain = null;
      if (files && files.length > 0) {
        // Normalise la demande utilisateur
        const userInput = filename.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase();
        // Cherche un fichier dont le chemin ou le nom finit par la demande (insensible à la casse)
        const matches = files.filter(f => {
          const norm = f.name.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase();
          return (
            norm === userInput ||
            norm.endsWith('/' + userInput) ||
            norm.endsWith(userInput)
          );
        });
        if (matches.length > 0) {
          // Prend le match avec le chemin le plus court (plus spécifique)
          fileToExplain = matches.reduce((a, b) => (a.name.length <= b.name.length ? a : b));
        }
      }
      if (!fileToExplain && selectedFile && (
        selectedFile.name.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase() === filename.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase() ||
        selectedFile.name.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase().endsWith(filename.replace(/\\/g, '/').replace(/^\.\/?/, '').toLowerCase())
      )) {
        fileToExplain = { name: selectedFile.name, content: fileCode };
      }
      setChatHistory(prev => [...prev, { role: 'user', content: input }]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: `Analyse du fichier ${filename} en cours...` }]);
      if (!fileToExplain) {
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Fichier ${filename} introuvable dans le projet.` }
        ]);
        setInput('');
        setLoading(false);
        setPendingCode(null);
        return;
      }
      try {
        const res = await fetch('/api/explain-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: fileToExplain.name, content: fileToExplain.content, useCloud: true }),
        });
        const data = await res.json();
        if (data.explanation) {
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: data.explanation }
          ]);
          setPendingCode(null);
        } else {
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: `Impossible d'obtenir une explication pour ${filename}.` }
          ]);
          setPendingCode(null);
        }
      } catch (e: any) {
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Erreur lors de l'explication du fichier ${filename}.` }
        ]);
        setPendingCode(null);
      }
      setInput('');
      setLoading(false);
      return;
    }
    // Pour la modification de code, selectedFile est requis
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier à modifier.');
      setLoading(false);
      return;
    }
    setChatHistory(prev => [...prev, { role: 'user', content: input }]);
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
        setChatHistory(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: data.modifiedCode }]);
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

  // Fonction d'export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    chatHistory.forEach((msg, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(msg.role === 'user' ? 'Utilisateur :' : 'Assistant :', 10, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      // Découpe le message si trop long
      const lines = doc.splitTextToSize(msg.content, 180);
      (lines as string[]).forEach((line: string) => {
        doc.text(line, 15, y);
        y += 6;
      });
      y += 4;
      if (y > 270 && i < chatHistory.length - 1) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save('chatbot_historique.pdf');
  };

  return (
    <div className="fixed right-0 top-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50 border-l border-gray-200 animate-slide-in">
      {/* Notification astuce */}
      {showTip && (
        <div className="bg-blue-50 border-b border-blue-200 text-blue-800 px-4 py-2 flex items-center justify-between text-sm">
          <span>
            <b>Astuce :</b> Utilisez <code>/search motclé</code> pour rechercher du code dans votre projet (ex : <code>/search function Navbar()</code>).
          </span>
          <button onClick={() => setShowTip(false)} className="ml-4 text-blue-600 hover:text-red-500 font-bold text-lg" aria-label="Fermer">×</button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
            <img src="/img/cap_logo_chatbot.png" alt="Logo Chatbot Capgemini" className="w-8 h-8" />
          </span>
          <h3 className="font-bold text-lg">Chatbot Code Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToPDF}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold border border-blue-200 rounded px-2 py-1 mr-2"
            title="Exporter l'historique en PDF"
          >
            Exporter en PDF
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold px-2" aria-label="Fermer">×</button>
        </div>
      </div>
      <div id="chatbot-messages" className="flex-1 overflow-y-auto mb-2 space-y-2 p-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-2 py-1 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {msg.role === 'assistant' ? (
                <ChatbotMessageMarkdown content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {error && <div className="text-red-600 text-xs">{error}</div>}
        {/* Validation des changements */}
        {pendingCode && (() => {
          // On n'affiche PAS les boutons si la dernière demande utilisateur était une explication ou une recherche
          const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');
          const isExplain = lastUserMsg && /(?:explique moi le code|explain file)/i.test(lastUserMsg.content);
          const isSearch = lastUserMsg && /\/search/i.test(lastUserMsg.content);
          if (isExplain || isSearch) return null;
          return (
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
          );
        })()}
      </div>
      <div className="flex gap-2 mt-2 p-4 border-t">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Demandez une modification du code..."
          disabled={loading}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-blue-600 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}

function ChatbotMessageMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const lang = match ? match[1] : 'javascript';
          return !inline ? (
            <pre className={`language-${lang} bg-gray-200 rounded p-2 my-2 text-xs text-left overflow-x-auto`} style={{maxWidth: 350}}>
              <code dangerouslySetInnerHTML={{ __html: Prism.highlight(String(children), Prism.languages[lang] || Prism.languages.javascript, lang) }} />
            </pre>
          ) : (
            <code className={className} {...props}>{children}</code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default ChatbotPanel; 