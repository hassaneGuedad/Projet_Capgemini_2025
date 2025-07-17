import { NextRequest, NextResponse } from 'next/server';

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  path: string;
  size: string;
  lastModified: string;
  description?: string;
}

async function createRepo(token: string, name: string, isPrivate: boolean) {
  const res = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      name,
      private: isPrivate,
      auto_init: true,
    }),
  });
  if (!res.ok) throw new Error('Erreur création repo: ' + (await res.text()));
  return res.json();
}

async function pushFile(token: string, owner: string, repo: string, file: ProjectFile) {
  // On suppose que file.path est le chemin relatif 
  const content = Buffer.from(file.description || '').toString('base64');
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      message: `Add ${file.path}`,
      content,
    }),
  });
  if (!res.ok) throw new Error('Erreur push fichier: ' + (await res.text()));
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { repoName, isPrivate, token, files } = await req.json();
    if (!repoName || !token || !files) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }
    // 1. Créer le repo
    const repo = await createRepo(token, repoName, isPrivate);
    const owner = repo.owner.login;
    const repoUrl = repo.html_url;
    // 2. Push tous les fichiers (un par un)
    for (const file of files) {
      if (file.type !== 'folder') {
        await pushFile(token, owner, repoName, file);
      }
    }
    return NextResponse.json({ url: repoUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur inconnue' }, { status: 500 });
  }
} 