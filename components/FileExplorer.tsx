import React, { useState, useRef } from 'react';
import { ProjectFile } from '@/types';
import { Folder, FileText, Search, Pencil, Trash2, Check, X, Plus, Image as ImageIcon, FileJson, FileCode2, FileArchive, File } from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  children?: FileNode[];
  file?: ProjectFile;
}

function buildFileTree(files: ProjectFile[]): FileNode[] {
  const root: FileNode[] = [];
  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;
    let currentPath = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? currentPath + '/' + part : part;
      let node = current.find(n => n.name === part);
      if (!node) {
        node = {
          name: part,
          path: currentPath,
          children: i === parts.length - 1 ? undefined : [],
          file: i === parts.length - 1 ? file : undefined,
        };
        current.push(node);
      }
      if (i < parts.length - 1) {
        if (!node.children) node.children = [];
        current = node.children;
      }
    }
  }
  return root;
}

interface FileExplorerProps {
  files: ProjectFile[];
  onSelectFile: (file: ProjectFile, lineNumber?: number) => void;
  selectedFile?: ProjectFile | null;
  onRenameFile?: (file: ProjectFile, newName: string) => void;
  onDeleteFile?: (file: ProjectFile) => void;
  onCreateFile?: (name: string) => void;
  onCreateFolder?: (name: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, selectedFile, onRenameFile, onDeleteFile, onCreateFile, onCreateFolder }) => {
  const tree = buildFileTree(files);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [creating, setCreating] = useState<'file' | 'folder' | null>(null);
  const [createValue, setCreateValue] = useState('');
  // Ajout pour création de plusieurs fichiers dans le dossier
  const [createFilesInFolder, setCreateFilesInFolder] = useState<string[]>(['']);
  // State pour le menu contextuel
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderPath: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu contextuel si on clique ailleurs
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contextMenu]);

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Recherche globale dans tous les fichiers
  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    const results: any[] = [];
    files.forEach(file => {
      const lines = (file.description ?? '').split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(value.toLowerCase())) {
          results.push({
            file,
            lineNumber: idx + 1,
            line,
          });
        }
      });
    });
    setSearchResults(results);
  };

  const handleRename = (file: ProjectFile) => {
    setRenamingPath(file.path);
    setRenameValue(file.name);
  };

  const handleRenameSubmit = (file: ProjectFile) => {
    if (onRenameFile && renameValue.trim() && renameValue !== file.name) {
      onRenameFile(file, renameValue.trim());
    }
    setRenamingPath(null);
    setRenameValue('');
  };

  const handleCreateSubmit = () => {
    if (creating === 'file' && onCreateFile && createValue.trim()) {
      onCreateFile(createValue.trim());
    }
    if (creating === 'folder' && onCreateFolder && createValue.trim()) {
      onCreateFolder(createValue.trim());
      // Crée tous les fichiers renseignés dans le dossier
      if (onCreateFile) {
        const folderPath = createValue.trim().endsWith('/') ? createValue.trim() : createValue.trim() + '/';
        createFilesInFolder.forEach(fileName => {
          if (fileName.trim()) {
            onCreateFile(folderPath + fileName.trim());
          }
        });
      }
    }
    setCreating(null);
    setCreateValue('');
    setCreateFilesInFolder(['']);
  };

  const handleCreateSubfolder = (parentPath: string) => {
    setCreating('folder');
    setCreateValue(parentPath.endsWith('/') ? parentPath : parentPath + '/');
    setCreateFilesInFolder(['']);
    setContextMenu(null);
  };

  const handleCreateFileInFolder = (parentPath: string) => {
    setCreating('file');
    setCreateValue(parentPath.endsWith('/') ? parentPath : parentPath + '/');
    setContextMenu(null);
  };

  // Icône par type de fichier
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return <File className="w-4 h-4 mr-1" />;
    if (["js", "jsx", "ts", "tsx"].includes(ext)) return <FileCode2 className="w-4 h-4 mr-1 text-yellow-500" />;
    if (["css", "scss", "sass", "less"].includes(ext)) return <FileCode2 className="w-4 h-4 mr-1 text-blue-500" />;
    if (["html", "htm"].includes(ext)) return <FileCode2 className="w-4 h-4 mr-1 text-orange-500" />;
    if (["json"].includes(ext)) return <FileJson className="w-4 h-4 mr-1 text-green-600" />;
    if (["png", "jpg", "jpeg", "gif", "svg", "bmp", "webp"].includes(ext)) return <ImageIcon className="w-4 h-4 mr-1 text-pink-500" />;
    if (["zip", "rar", "tar", "gz"].includes(ext)) return <FileArchive className="w-4 h-4 mr-1 text-purple-500" />;
    if (["md", "markdown"].includes(ext)) return <FileCode2 className="w-4 h-4 mr-1 text-gray-500" />;
    return <FileText className="w-4 h-4 mr-1 text-gray-400" />;
  };

  const renderTree = (nodes: FileNode[], depth = 0) => (
    <ul className="pl-2">
      {nodes.map(node => (
        <li key={node.path} className="mb-1">
          {node.children ? (
            <div>
              <div
                className="flex items-center cursor-pointer hover:text-blue-600 relative"
                style={{ paddingLeft: depth * 12 }}
                onClick={() => toggleFolder(node.path)}
                onContextMenu={e => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, folderPath: node.path });
                }}
              >
                <Folder className="w-4 h-4 mr-1" />
                <span>{node.name}</span>
                <span className="ml-1 text-xs">{openFolders[node.path] ? '▼' : '▶'}</span>
              </div>
              {openFolders[node.path] && node.children && renderTree(node.children, depth + 1)}
            </div>
          ) : (
            <div
              className={`flex items-center cursor-pointer hover:text-blue-600 ${selectedFile?.path === node.path ? 'font-bold text-blue-700' : ''}`}
              style={{ paddingLeft: depth * 12 + 20 }}
            >
              {getFileIcon(node.name)}
              {renamingPath === node.path ? (
                <>
                  <input
                    className="border rounded px-1 text-xs w-24 mr-1"
                    value={renameValue}
                    autoFocus
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenameSubmit(node.file!);
                      if (e.key === 'Escape') setRenamingPath(null);
                    }}
                  />
                  <button className="text-green-600 mr-1" onClick={() => handleRenameSubmit(node.file!)}><Check className="w-4 h-4" /></button>
                  <button className="text-gray-500" onClick={() => setRenamingPath(null)}><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <span onClick={() => node.file && onSelectFile(node.file)}>{node.name}</span>
                  {onRenameFile && (
                    <button className="ml-2 text-blue-500 hover:text-blue-700" title="Renommer" onClick={e => { e.stopPropagation(); handleRename(node.file!); }}><Pencil className="w-4 h-4" /></button>
                  )}
                  {onDeleteFile && (
                    <button className="ml-1 text-red-500 hover:text-red-700" title="Supprimer" onClick={e => { e.stopPropagation(); onDeleteFile(node.file!); }}><Trash2 className="w-4 h-4" /></button>
                  )}
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-white rounded shadow p-3 w-80 min-h-[500px] max-h-[800px] overflow-auto relative">
      {/* Menu contextuel pour dossier */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 bg-white border rounded shadow px-2 py-1 text-sm"
          style={{ top: contextMenu.y - 8, left: contextMenu.x - 8 }}
        >
          <button
            className="block w-full text-left px-2 py-1 hover:bg-blue-100 rounded"
            onClick={() => handleCreateFileInFolder(contextMenu.folderPath)}
          >
            + Créer un fichier
          </button>
        </div>
      )}
      <div className="font-semibold mb-2 flex items-center gap-2">
        Explorateur de fichiers
        {onCreateFile && (
          <button className="ml-auto text-blue-600 hover:text-blue-800 flex items-center" title="Nouveau fichier" onClick={() => { setCreating('file'); setCreateValue(''); }}><Plus className="w-4 h-4 mr-1" />Fichier</button>
        )}
        {onCreateFolder && (
          <button className="text-green-600 hover:text-green-800 flex items-center" title="Nouveau dossier" onClick={() => { setCreating('folder'); setCreateValue(''); }}><Plus className="w-4 h-4 mr-1" />Dossier</button>
        )}
      </div>
      {creating && (
        <div className="flex flex-col mb-2 gap-1">
          <div className="flex items-center gap-1">
            <input
              className="border rounded px-1 text-xs w-32 mr-1"
              value={createValue}
              autoFocus
              onChange={e => setCreateValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateSubmit();
                if (e.key === 'Escape') { setCreating(null); setCreateValue(''); setCreateFilesInFolder(['']); }
              }}
              placeholder={creating === 'file' ? 'Nom du fichier...' : 'Nom du dossier...'}
            />
            {/* Champs pour créer plusieurs fichiers dans le dossier */}
            {creating === 'folder' && (
              <div className="flex flex-col gap-1">
                {createFilesInFolder.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-1 mt-1">
                    <input
                      className="border rounded px-1 text-xs w-32"
                      value={file}
                      onChange={e => {
                        const arr = [...createFilesInFolder];
                        arr[idx] = e.target.value;
                        setCreateFilesInFolder(arr);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCreateSubmit();
                        if (e.key === 'Escape') { setCreating(null); setCreateValue(''); setCreateFilesInFolder(['']); }
                      }}
                      placeholder={`Fichier ${idx + 1} (optionnel)`}
                    />
                    {createFilesInFolder.length > 1 && (
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer ce fichier"
                        onClick={() => {
                          setCreateFilesInFolder(arr => arr.filter((_, i) => i !== idx));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="text-blue-500 hover:text-blue-700 text-xs mt-1 self-start"
                  type="button"
                  onClick={() => setCreateFilesInFolder(arr => [...arr, ''])}
                >
                  + Ajouter un fichier
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <button className="text-green-600 mr-1" onClick={handleCreateSubmit}><Check className="w-4 h-4" /></button>
            <button className="text-gray-500" onClick={() => { setCreating(null); setCreateValue(''); setCreateFilesInFolder(['']); }}><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <div className="mb-2 relative">
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Recherche globale..."
          className="w-full border rounded px-2 py-1 text-sm pl-8"
        />
        <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
      </div>
      {search && searchResults.length > 0 && (
        <div className="mb-2 max-h-40 overflow-auto border rounded bg-gray-50">
          <div className="text-xs text-gray-500 px-2 py-1">Résultats ({searchResults.length})</div>
          <ul>
            {searchResults.map((res, idx) => (
              <li
                key={idx}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs"
                onClick={() => onSelectFile(res.file, res.lineNumber)}
              >
                <span className="font-semibold text-blue-700">{res.file.name}</span>
                <span className="ml-2 text-gray-500">Ligne {res.lineNumber}</span>
                <div className="truncate text-gray-700">{res.line.trim()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {renderTree(tree)}
    </div>
  );
}; 