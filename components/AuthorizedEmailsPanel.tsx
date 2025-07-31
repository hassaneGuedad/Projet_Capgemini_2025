'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { 
  Users, 
  Plus, 
  Trash2, 
  Search, 
  Building, 
  User, 
  Calendar,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  Download
} from 'lucide-react';
import { AuthorizedEmail } from '../services/authorized-emails';
import { useAuth } from '../contexts/AuthContext';

// Fonction utilitaire pour formater les dates de manière sécurisée
const formatDate = (date: any): string => {
  try {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    } else if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    } else if (date) {
      return new Date(date).toLocaleDateString();
    } else {
      return 'Date inconnue';
    }
  } catch (error) {
    console.error('❌ Erreur formatage date:', error);
    return 'Date invalide';
  }
};

interface AuthorizedEmailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthorizedEmailsPanel({ isOpen, onClose }: AuthorizedEmailsPanelProps) {
  const { user } = useAuth();
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [stats, setStats] = useState<{ total: number; domains: Record<string, number> }>({ total: 0, domains: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email === 'scapworkspace@gmail.com';
  
  console.log('🔍 AuthorizedEmailsPanel - User:', user?.email);
  console.log('🔍 AuthorizedEmailsPanel - Is Admin:', isAdmin);

  // Formulaire d'ajout
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);

  // Formulaire d'ajout en lot
  const [bulkEmails, setBulkEmails] = useState('');
  const [addingBulk, setAddingBulk] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importingCsv, setImportingCsv] = useState(false);

  // Charger les emails autorisés
  const loadEmails = async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 Chargement emails - User email:', user?.email);
    
    try {
      const response = await fetch('/api/admin/authorized-emails', {
        headers: {
          'x-user-email': user?.email || ''
        }
      });
      const data = await response.json();

      console.log('🔍 Chargement emails - Response status:', response.status);
      console.log('🔍 Chargement emails - Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setEmails(data.emails);
      setStats(data.stats);
    } catch (err: any) {
      console.error('❌ Erreur chargement emails:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un email autorisé
  const addEmail = async () => {
    if (!newEmail.trim()) {
      setError('Email requis');
      return;
    }

    setAddingEmail(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/authorized-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          company: newCompany.trim(),
          role: newRole.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout');
      }

      // Réinitialiser le formulaire
      setNewEmail('');
      setNewCompany('');
      setNewRole('');
      
      // Recharger la liste
      await loadEmails();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setAddingEmail(false);
    }
  };

  // Ajouter des emails en lot
  const addBulkEmails = async () => {
    if (!bulkEmails.trim()) {
      setError('Liste d\'emails requise');
      return;
    }

    setAddingBulk(true);
    setError(null);

    try {
      // Parser la liste d'emails (format: email,entreprise,rôle)
      const emailLines = bulkEmails.trim().split('\n').filter(line => line.trim());
      const bulkEmailData = emailLines.map(line => {
        const parts = line.split(',').map(part => part.trim());
        return {
          email: parts[0] || '',
          company: parts[1] || '',
          role: parts[2] || ''
        };
      }).filter(item => item.email);

      if (bulkEmailData.length === 0) {
        throw new Error('Aucun email valide trouvé');
      }

      const response = await fetch('/api/admin/authorized-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          bulkEmails: bulkEmailData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout en lot');
      }

      // Réinitialiser le formulaire
      setBulkEmails('');
      
      // Recharger la liste
      await loadEmails();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setAddingBulk(false);
    }
  };

  // Supprimer un email autorisé
  const removeEmail = async (emailId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet email autorisé ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/authorized-emails/${emailId}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': user?.email || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      // Recharger la liste
      await loadEmails();
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    }
  };

  // Exporter la liste
  const exportEmails = () => {
    const csvContent = [
      'Email,Entreprise,Rôle,Date d\'ajout',
      ...emails.map(email => 
        `${email.email},${email.company || ''},${email.role || ''},${formatDate(email.addedAt)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails-autorises.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Importer depuis un fichier CSV
  const importCsvFile = async () => {
    if (!csvFile) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setImportingCsv(true);
    setError(null);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');
      }

      // Ignorer l'en-tête
      const dataLines = lines.slice(1);
      const bulkEmailData = dataLines.map(line => {
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
        return {
          email: parts[0] || '',
          company: parts[1] || '',
          role: parts[2] || ''
        };
      }).filter(item => item.email && item.email.includes('@'));

      if (bulkEmailData.length === 0) {
        throw new Error('Aucun email valide trouvé dans le fichier CSV');
      }

      const response = await fetch('/api/admin/authorized-emails', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          bulkEmails: bulkEmailData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'import');
      }

      // Réinitialiser
      setCsvFile(null);
      await loadEmails();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'import CSV');
    } finally {
      setImportingCsv(false);
    }
  };

  // Charger les données au montage et quand le panel s'ouvre
  useEffect(() => {
    if (isOpen && isAdmin) {
      // Utiliser setTimeout pour éviter les problèmes de setState pendant le rendu
      const timer = setTimeout(() => {
        loadEmails();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAdmin]);

  // Filtrer les emails selon la recherche
  const filteredEmails = emails.filter(email =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;
  
  // Vérification de sécurité - si l'utilisateur n'est pas admin, fermer le panel
  if (!isAdmin) {
    console.log('❌ Accès refusé - Utilisateur non admin');
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="authorized-emails-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h2 id="authorized-emails-title" className="text-xl font-bold text-gray-900">Gestion des Emails Autorisés</h2>
              <p className="text-sm text-gray-600">Restreindre l'accès à la plateforme</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Liste ({emails.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Lot
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Import CSV
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            {/* Onglet Liste */}
            <TabsContent value="list" className="mt-6">
              <div className="space-y-4">
                {/* Barre de recherche et export */}
                                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher par email, entreprise ou rôle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={exportEmails} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter CSV
                    </Button>
                    <Button onClick={() => setActiveTab('add')} variant="default" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Email
                    </Button>
                  </div>

                {/* Liste des emails */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Chargement...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">{error}</p>
                    <Button onClick={loadEmails} className="mt-2">Réessayer</Button>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {searchTerm ? 'Aucun email trouvé' : 'Aucun email autorisé'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmails.map((email) => (
                      <Card key={email.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{email.email}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {email.email.split('@')[1]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {email.company && (
                                  <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {email.company}
                                  </div>
                                )}
                                {email.role && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {email.role}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(email.addedAt)}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmail(email.id!)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Onglet Ajouter */}
            <TabsContent value="add" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Ajouter un Email Autorisé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@entreprise.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      placeholder="Nom de l'entreprise"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      placeholder="Poste ou rôle"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={addEmail} 
                    disabled={addingEmail || !newEmail.trim()}
                    className="w-full"
                  >
                    {addingEmail ? 'Ajout en cours...' : 'Ajouter l\'Email'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Import en Lot */}
            <TabsContent value="bulk" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Importer des Emails en Lot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bulk-emails">Liste d'emails (format CSV)</Label>
                    <Textarea
                      id="bulk-emails"
                      placeholder="email@entreprise.com,Entreprise,Rôle&#10;autre@entreprise.com,Autre Entreprise,Autre Rôle"
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format : email,entreprise,rôle (une ligne par email)
                    </p>
                  </div>
                  <Button 
                    onClick={addBulkEmails} 
                    disabled={addingBulk || !bulkEmails.trim()}
                    className="w-full"
                  >
                    {addingBulk ? 'Import en cours...' : 'Importer les Emails'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Import CSV */}
            <TabsContent value="csv" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Importer depuis un Fichier CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="csv-file">Sélectionner un fichier CSV</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format attendu : Email,Entreprise,Rôle (avec en-tête)
                    </p>
                  </div>
                  
                  {csvFile && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📁 Fichier sélectionné : {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Exemple de format CSV :</h4>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                      Email,Entreprise,Rôle<br/>
                      john@capgemini.com,Capgemini,Développeur<br/>
                      jane@entreprise.com,Entreprise,Manager<br/>
                      test@example.com,Example Corp,Testeur
                    </div>
                  </div>

                  <Button 
                    onClick={importCsvFile} 
                    disabled={importingCsv || !csvFile}
                    className="w-full"
                  >
                    {importingCsv ? 'Import en cours...' : 'Importer le Fichier CSV'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Statistiques */}
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Statistiques générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Vue d'Ensemble
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total des emails autorisés</span>
                        <Badge variant="outline" className="text-lg font-bold">
                          {stats.total}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Domaines uniques</span>
                        <Badge variant="outline">
                          {Object.keys(stats.domains).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top domaines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Top Domaines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.domains)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([domain, count]) => (
                          <div key={domain} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">@{domain}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 