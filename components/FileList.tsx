'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProjectFile } from '@/types';
import { 
  FileText, 
  Folder, 
  Search,
  Calendar,
  Weight,
  Component,
  FileCode,
  Settings,
  Palette
} from 'lucide-react';

interface FileListProps {
  files: ProjectFile[];
  onSelectFile?: (file: ProjectFile) => void;
  selectedFile?: ProjectFile | null;
}

export const FileList: React.FC<FileListProps> = ({ files, onSelectFile, selectedFile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'component': return <Component className="h-4 w-4 text-blue-500" />;
      case 'page': return <FileText className="h-4 w-4 text-green-500" />;
      case 'api': return <FileCode className="h-4 w-4 text-purple-500" />;
      case 'config': return <Settings className="h-4 w-4 text-gray-500" />;
      case 'style': return <Palette className="h-4 w-4 text-pink-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'component': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'page': return 'bg-green-100 text-green-700 border-green-200';
      case 'api': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'config': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'style': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const fileTypes = [
    { value: 'all', label: 'Tous' },
    { value: 'component', label: 'Composants' },
    { value: 'page', label: 'Pages' },
    { value: 'api', label: 'API' },
    { value: 'config', label: 'Configuration' },
    { value: 'style', label: 'Styles' }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Folder className="h-5 w-5 text-blue-600" />
          <span>Structure du Projet</span>
          <Badge variant="outline" className="ml-auto">
            {filteredFiles.length} fichiers
          </Badge>
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {fileTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  selectedType === type.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun fichier trouvé</p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group ${selectedFile?.id === file.id ? 'bg-blue-100' : ''}`}
                onClick={() => onSelectFile?.(file)}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                        {file.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeBadgeColor(file.type)}`}
                      >
                        {file.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{file.path}</p>
                    {file.description && (
                      <p className="text-xs text-gray-400 truncate mt-1">{file.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Weight className="h-3 w-3" />
                    <span>{file.size}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{file.lastModified.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};