'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3, 
  GitBranch, 
  Activity, 
  Database, 
  FileText, 
  Download, 
  Copy,
  Loader2,
  Eye,
  Code,
  Play,
  ChevronDown,
  FileText as FileTextIcon,
  Image as ImageIcon
} from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';

interface UMLPanelProps {
  files: any[];
}

interface UMLResult {
  diagram: string;
  diagramName: string;
  data: any;
  stats: {
    classes: number;
    components: number;
    relationships: number;
    functions: number;
  };
}

export function UMLPanel({ files }: UMLPanelProps) {
  const [selectedDiagram, setSelectedDiagram] = useState('class');
  const [result, setResult] = useState<UMLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [diagramRendered, setDiagramRendered] = useState(false);

  const diagramTypes = [
    { value: 'class', label: 'Classes', icon: BarChart3, description: 'Structure des classes et leurs relations' },
    { value: 'component', label: 'Composants', icon: GitBranch, description: 'Architecture des composants' },
    { value: 'sequence', label: 'Séquence', icon: Activity, description: 'Flux d\'interactions' },
    { value: 'activity', label: 'Activité', icon: Activity, description: 'Workflow de l\'application' },
    { value: 'er', label: 'Entité-Relation', icon: Database, description: 'Structure de la base de données' }
  ];

  // Exemple de données de test
  const testFiles = [
    {
      name: 'Book.java',
      content: `
public class Book {
    private String id;
    private String title;
    private String author;
    private String isbn;
    private int year;
    private BookGenre genre;
    private boolean available;
    
    public Book(String id, String title, String author, String isbn, int year, BookGenre genre) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.genre = genre;
        this.available = true;
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public boolean isAvailable() {
        return available;
    }
    
    public void setAvailable(boolean available) {
        this.available = available;
    }
    
    @Override
    public String toString() {
        return "Book{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", available=" + available +
                '}';
    }
}
      `
    },
    {
      name: 'Author.java',
      content: `
public class Author {
    private String id;
    private String firstName;
    private String lastName;
    private String biography;
    private List<Book> books;
    
    public Author(String id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.books = new ArrayList<>();
    }
    
    public void addBook(Book book) {
        this.books.add(book);
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public String getId() {
        return id;
    }
    
    public List<Book> getBooks() {
        return new ArrayList<>(books);
    }
}
      `
    },
    {
      name: 'BookService.java',
      content: `
public class BookService {
    private List<Book> books;
    private List<Author> authors;
    
    public BookService() {
        this.books = new ArrayList<>();
        this.authors = new ArrayList<>();
    }
    
    public Book addBook(Book book) {
        books.add(book);
        return book;
    }
    
    public Book findBookById(String id) throws BookNotFoundException {
        return books.stream()
                .filter(book -> book.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
    }
    
    public List<Book> searchBooksByTitle(String title) {
        return books.stream()
                .filter(book -> book.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
    }
    
    public List<Book> searchBooksByAuthor(String authorName) {
        return books.stream()
                .filter(book -> book.getAuthor().toLowerCase().contains(authorName.toLowerCase()))
                .collect(Collectors.toList());
    }
    
    public boolean removeBook(String id) {
        return books.removeIf(book -> book.getId().equals(id));
    }
    
    public List<Book> getAllBooks() {
        return new ArrayList<>(books);
    }
}
      `
    },
    {
      name: 'BookGenre.java',
      content: `
public enum BookGenre {
    ROMAN("Roman"),
    SCIENCE_FICTION("Science Fiction"),
    HISTOIRE("Histoire"),
    TECHNIQUE("Technique"),
    POESIE("Poésie"),
    THEATRE("Théâtre"),
    ESSAI("Essai");
    
    private final String displayName;
    
    BookGenre(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}
      `
    },
    {
      name: 'BookNotFoundException.java',
      content: `
public class BookNotFoundException extends Exception {
    public BookNotFoundException(String message) {
        super(message);
    }
    
    public BookNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
      `
    },
    {
      name: 'Library.java',
      content: `
public class Library {
    private BookService bookService;
    private MemberService memberService;
    private LoanService loanService;
    
    public Library() {
        this.bookService = new BookService();
        this.memberService = new MemberService();
        this.loanService = new LoanService();
    }
    
    public Book borrowBook(String bookId, String memberId) throws BookNotFoundException, MemberNotFoundException {
        Book book = bookService.findBookById(bookId);
        Member member = memberService.findMemberById(memberId);
        
        if (!book.isAvailable()) {
            throw new IllegalStateException("Book is not available");
        }
        
        book.setAvailable(false);
        Loan loan = new Loan(book, member);
        loanService.addLoan(loan);
        
        return book;
    }
    
    public void returnBook(String bookId) throws BookNotFoundException {
        Book book = bookService.findBookById(bookId);
        book.setAvailable(true);
        loanService.returnBook(bookId);
    }
    
    public List<Book> searchBooks(String query) {
        List<Book> results = new ArrayList<>();
        results.addAll(bookService.searchBooksByTitle(query));
        results.addAll(bookService.searchBooksByAuthor(query));
        return results.stream().distinct().collect(Collectors.toList());
    }
    
    public BookService getBookService() {
        return bookService;
    }
    
    public MemberService getMemberService() {
        return memberService;
    }
    
    public LoanService getLoanService() {
        return loanService;
    }
}
      `
    }
  ];

  const generateDiagram = async () => {
    const filesToAnalyze = files.length > 0 ? files : testFiles;
    
    if (!filesToAnalyze || filesToAnalyze.length === 0) {
      setError('Aucun fichier à analyser');
      return;
    }

    setLoading(true);
    setError(null);
    setDiagramRendered(false);

    try {
      // Adapter les fichiers selon leur structure
      const adaptedFiles = filesToAnalyze.map(f => ({
        name: f.name,
        content: f.content || f.description || '' // Supporte les deux formats
      }));

      console.log('Fichiers à analyser:', adaptedFiles.map(f => ({ name: f.name, contentLength: f.content.length })));

      const response = await fetch('/api/uml/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          files: adaptedFiles,
          diagramType: selectedDiagram 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.diagram) {
      try {
        await navigator.clipboard.writeText(result.diagram);
        // Optionnel: afficher un toast de succès
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    }
  };

  const downloadDiagram = async (format: 'mermaid' | 'svg' = 'mermaid') => {
    if (!result?.diagram) return;

    try {
      // Pour le format SVG, vérifier que le diagramme est rendu
      if (format === 'svg') {
        // Attendre un peu que le diagramme se charge
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Vérifier si on est dans l'onglet preview
        if (activeTab !== 'preview') {
          throw new Error('Ouvrez d\'abord l\'onglet Prévisualisation pour télécharger en SVG');
        }
      }
              if (format === 'mermaid') {
          // Télécharger le code Mermaid
          const blob = new Blob([result.diagram], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${result.diagramName.toLowerCase().replace(/\s+/g, '-')}.mermaid`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log('✅ Code Mermaid téléchargé avec succès');
        } else if (format === 'svg') {
        // Télécharger en image - Approche alternative pour éviter les problèmes CORS
        let svgElement = document.querySelector('.mermaid-diagram svg') as SVGElement;
        if (!svgElement) {
          // Essayer d'autres sélecteurs possibles
          const alternativeSelectors = [
            '.mermaid svg',
            '.mermaid-diagram svg',
            '[class*="mermaid"] svg',
            'svg'
          ];
          
          let foundSvg = null;
          for (const selector of alternativeSelectors) {
            foundSvg = document.querySelector(selector) as SVGElement;
            if (foundSvg) {
              console.log('SVG trouvé avec le sélecteur:', selector);
              break;
            }
          }
          
          if (!foundSvg) {
            console.log('Sélecteurs testés:', alternativeSelectors);
            console.log('Éléments SVG trouvés:', document.querySelectorAll('svg').length);
            throw new Error('Aucun diagramme SVG trouvé. Assurez-vous que le diagramme est affiché dans l\'onglet Prévisualisation et qu\'il s\'est chargé correctement.');
          }
          
          svgElement = foundSvg;
        }

        // Télécharger directement le SVG
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${result.diagramName.toLowerCase().replace(/\s+/g, '-')}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        console.log(`✅ SVG téléchargé avec succès. Vous pouvez le convertir en PNG/JPG avec un éditeur d'image.`);
        
        // Afficher un message informatif
        alert(`SVG téléchargé avec succès !\n\nPour obtenir une image PNG/JPG, vous pouvez :\n1. Ouvrir le fichier SVG dans un navigateur\n2. Faire un clic droit → "Enregistrer l'image sous..."\n3. Choisir le format PNG ou JPG\n\nOu utiliser un outil en ligne comme :\n- convertio.co\n- cloudconvert.com`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      alert(`Erreur lors du téléchargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const getSelectedDiagramInfo = () => {
    return diagramTypes.find(d => d.value === selectedDiagram);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Générateur UML</h2>
          <p className="text-gray-600">Analyse automatique du code et génération de diagrammes</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {files.length > 0 ? `${files.length} fichiers` : 'Mode démo'}
        </Badge>
      </div>

      {/* Sélection du type de diagramme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Type de diagramme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagramTypes.map((diagramType) => {
              const Icon = diagramType.icon;
              return (
                <div
                  key={diagramType.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDiagram === diagramType.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDiagram(diagramType.value)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${
                      selectedDiagram === diagramType.value ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div>
                      <h3 className="font-medium">{diagramType.label}</h3>
                      <p className="text-sm text-gray-600">{diagramType.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bouton de génération */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Button
              onClick={generateDiagram}
              disabled={loading}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Générer le diagramme {getSelectedDiagramInfo()?.label}
                </>
              )}
            </Button>
            
            {files.length === 0 && (
              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Mode démo :</strong> Utilisation de fichiers d'exemple pour tester le générateur UML
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Erreur : {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {result.diagramName}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Télécharger
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadDiagram('mermaid')}>
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Code Mermaid (.mermaid)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => downloadDiagram('svg')}
                      disabled={activeTab !== 'preview' || !diagramRendered}
                      title={
                        activeTab !== 'preview' 
                          ? 'Ouvrez l\'onglet Prévisualisation pour télécharger en SVG'
                          : !diagramRendered 
                            ? 'Attendez que le diagramme soit chargé'
                            : 'Télécharge en SVG (convertible en PNG/JPG)'
                      }
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image SVG (.svg)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.stats.classes}</div>
                <div className="text-sm text-blue-700">Classes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.stats.components}</div>
                <div className="text-sm text-green-700">Composants</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.stats.relationships}</div>
                <div className="text-sm text-purple-700">Relations</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{result.stats.functions}</div>
                <div className="text-sm text-orange-700">Fonctions</div>
              </div>
            </div>

            {/* Onglets pour prévisualisation et code */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Prévisualisation
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  Code Mermaid
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-4 bg-white">
                  {result.diagram ? (
                    <MermaidDiagram 
                      chart={result.diagram} 
                      onRendered={() => setDiagramRendered(true)}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Aucun diagramme à afficher</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <div className="border rounded-lg">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Code Mermaid</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                  </div>
                  <pre className="p-4 bg-gray-50 text-sm overflow-auto max-h-96">
                    {result.diagram}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 