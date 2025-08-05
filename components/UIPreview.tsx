'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UIComponent } from '@/types';
import { 
  Eye, 
  Code, 
  Palette,
  MousePointer,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface UIPreviewProps {
  components: UIComponent[];
}

export const UIPreview: React.FC<UIPreviewProps> = ({ components }) => {
  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(components[0] || null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'button': return '🔘';
      case 'form': return '📝';
      case 'card': return '🃏';
      case 'modal': return '📱';
      case 'navbar': return '🧭';
      default: return '🎨';
    }
  };

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getPreviewContainerClass = () => {
    switch (viewMode) {
      case 'desktop': return 'w-full max-w-4xl';
      case 'tablet': return 'w-full max-w-2xl';
      case 'mobile': return 'w-full max-w-sm';
      default: return 'w-full max-w-4xl';
    }
  };

  const renderPreviewContent = (component: UIComponent) => {
    switch (component.type) {
      case 'button':
        return (
          <div className="space-y-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Bouton Principal
            </Button>
            <Button variant="outline">
              Bouton Secondaire
            </Button>
            <Button variant="ghost">
              Bouton Transparent
            </Button>
          </div>
        );
      
      case 'form':
        return (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input placeholder="Votre nom" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="votre@email.com" />
            </div>
            <Button className="w-full">Envoyer</Button>
          </div>
        );
      
      case 'card':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Titre de la carte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Contenu de la carte avec du texte d'exemple et des éléments interactifs.
              </p>
              <div className="mt-4 flex space-x-2">
                <Button size="sm">Action</Button>
                <Button variant="outline" size="sm">Annuler</Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'navbar':
        return (
          <div className="w-full bg-white shadow-sm border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                <span className="font-semibold">Logo</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-blue-600">Accueil</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Produits</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
              </div>
              <Button size="sm">Connexion</Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Aperçu du composant</p>
          </div>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-purple-600" />
          <span>Aperçu des Composants UI</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Code</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            {/* Component Selector */}
            <div className="flex flex-wrap gap-2">
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    selectedComponent?.id === component.id
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{getComponentIcon(component.type)}</span>
                  <span className="text-sm">{component.name}</span>
                </button>
              ))}
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Affichage:</span>
              <div className="flex space-x-2">
                {['desktop', 'tablet', 'mobile'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      viewMode === mode
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getViewModeIcon(mode)}
                    <span className="text-sm capitalize">{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Container */}
            <div className="border rounded-lg p-8 bg-gray-50">
              <div className={`mx-auto transition-all duration-300 ${getPreviewContainerClass()}`}>
                {selectedComponent ? (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {selectedComponent.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{selectedComponent.name}</span>
                    </div>
                    {renderPreviewContent(selectedComponent)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MousePointer className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Sélectionnez un composant pour voir l&apos;aperçu</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>
{`// Exemple de code pour ${selectedComponent?.name || 'le composant'}
import React from 'react';

export const ${selectedComponent?.name || 'Component'} = () => {
  return (
    <div className="component">
      {/* Contenu du composant */}
    </div>
  );
};`}
                </code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};