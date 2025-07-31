'use client';

import React, { useState, useEffect } from 'react';
import { PromptForm } from '@/components/PromptForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Zap, 
  Code, 
  Layers, 
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Info,
  Shield,
  X
} from 'lucide-react';
import { AuthorizedEmailsPanel } from '@/components/AuthorizedEmailsPanel';
import { useAuth } from '@/contexts/AuthContext';


export default function Home() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      title: 'IA Avancée',
      description: 'Agents IA spécialisés pour analyser et planifier votre projet'
    },
    {
      icon: <Code className="h-6 w-6 text-purple-500" />,
      title: 'Code Optimisé',
      description: 'Génération de code propre et maintenable avec les meilleures pratiques'
    },
    {
      icon: <Layers className="h-6 w-6 text-green-500" />,
      title: 'Architecture Modulaire',
      description: 'Structure de projet claire et extensible'
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: 'Développement Rapide',
      description: 'Réduction significative du temps de développement'
    }
  ];

  const stats = [
    { icon: <Users className="h-5 w-5" />, value: '10K+', label: 'Développeurs' },
    { icon: <CheckCircle className="h-5 w-5" />, value: '50K+', label: 'Projets générés' },
    { icon: <Clock className="h-5 w-5" />, value: '80%', label: 'Temps économisé' },
    { icon: <TrendingUp className="h-5 w-5" />, value: '4.9/5', label: 'Satisfaction' }
  ];

  // Ajout pour la recherche de code
  const [searchInput, setSearchInput] = useState('');
  type SearchResult = { file: string; snippet: string; startLine: number };
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showTip, setShowTip] = useState(true);

  // État pour la gestion des emails autorisés
  const [isAuthorizedEmailsOpen, setIsAuthorizedEmailsOpen] = useState(false);
  
  // Contexte d'authentification
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur peut accéder au panel d'administration
  const canAccessAdminPanel = user?.email === 'scapworkspace@gmail.com';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchResults([]);
    if (!searchInput.trim().toLowerCase().startsWith('/search ')) return;
    const query = searchInput.replace(/^\/search /i, '').trim();
    if (!query) return;
    setSearchLoading(true);
    try {
      const res = await fetch('/api/code-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results as SearchResult[]);
      } else {
        setSearchError('Aucun résultat trouvé.');
      }
    } catch (e) {
      setSearchError("Erreur lors de la recherche.");
    }
    setSearchLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Bouton flottant pour la gestion des emails autorisés - Visible uniquement pour l'admin */}
      {canAccessAdminPanel && (
        <Button
          onClick={() => setIsAuthorizedEmailsOpen(true)}
          className="fixed top-20 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          title="Gestion des Emails Autorisés (Admin)"
        >
          <Shield className="w-4 h-4 mr-2" />
          Gérer les Accès
        </Button>
      )}

              {/* Panel des Emails Autorisés - Accessible uniquement pour l'admin */}
        {isAuthorizedEmailsOpen && canAccessAdminPanel && (
          <AuthorizedEmailsPanel 
            isOpen={isAuthorizedEmailsOpen}
            onClose={() => setIsAuthorizedEmailsOpen(false)}
          />
        )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Nouveau : Agents IA Spécialisés
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Créez des projets web
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              avec l'IA
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SmartProjectBuilder utilise des agents IA avancés pour comprendre vos besoins, 
            planifier l'architecture et générer un code de qualité production. 
            Transformez vos idées en applications web complètes en quelques minutes.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-blue-500">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Astuce utilisateur juste au-dessus du PromptForm */}
        {showTip && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 flex items-center gap-3 rounded shadow">
            <Info className="h-6 w-6 text-yellow-500" />
            <div className="text-yellow-900 text-base flex-1">
              <b>Astuce :</b> Pour obtenir un code complet et de qualité pour votre projet, décrivez votre besoin de façon <b>claire et détaillée</b> dans le prompt. Plus votre prompt est précis, plus le résultat sera complet !
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="ml-4 text-yellow-700 hover:text-red-500 font-bold text-lg px-2 self-center"
              aria-label="Fermer l'astuce"
            >
              ×
            </button>
          </div>
        )}

        {/* Form Section */}
        <div className="mb-16">
          <PromptForm />
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SmartProjectBuilder ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre plateforme combine la puissance de l'IA avec l'expertise en développement 
              pour créer des solutions web exceptionnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-gray-50">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Un processus simple et efficace en 3 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Décrivez votre projet</h3>
              <p className="text-gray-600">
                Expliquez votre vision en détail. Plus vous êtes précis, meilleur sera le résultat.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">L'IA planifie</h3>
              <p className="text-gray-600">
                Nos agents IA analysent votre demande et créent un plan technique détaillé.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Obtenez votre code</h3>
              <p className="text-gray-600">
                Récupérez un projet complet avec du code propre et bien documenté.
              </p>
            </div>
          </div>
        </div>

        {/* Section Accès Restreint */}
        <div className="max-w-4xl mx-auto mt-20">
          <Card className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Accès Restreint aux Emails Professionnels
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cette plateforme est réservée aux utilisateurs ayant une adresse email professionnelle autorisée. 
                    <strong>Seuls les emails préalablement ajoutés par l'administrateur peuvent créer un compte.</strong> 
                    Si votre email n'est pas autorisé, contactez l'administrateur pour demander l'accès.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Sécurité Renforcée
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      <Users className="w-3 h-3 mr-1" />
                      Accès Contrôlé
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Emails Vérifiés
                    </Badge>
                  </div>
                </div>
                {canAccessAdminPanel ? (
                  <Button
                    onClick={() => setIsAuthorizedEmailsOpen(true)}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Gérer les Accès
                  </Button>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                    <Shield className="w-3 h-3 mr-1" />
                    Accès Administrateur Requis
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}