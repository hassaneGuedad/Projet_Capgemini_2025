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

async function createSite(token: string) {
  const res = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Erreur création site Netlify: ' + (await res.text()));
  return res.json();
}

async function deployFiles(token: string, siteId: string, files: ProjectFile[]) {
  // Préparer le body sous forme de multipart/form-data
  const form = new FormData();
  for (const file of files) {
    if (file.type !== 'folder') {
      // file.path = chemin relatif, file.description = contenu
      form.append('files[]', new Blob([file.description || ''], { type: 'text/plain' }), file.path);
    }
  }
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form as any,
  });
  if (!res.ok) throw new Error('Erreur déploiement Netlify: ' + (await res.text()));
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { token, files } = await req.json();
    if (!token || !files) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }
    // 1. Créer un site Netlify
    const site = await createSite(token);
    // 2. Déployer les fichiers
    const deploy = await deployFiles(token, site.id, files);
    // 3. Retourner l’URL du site
    return NextResponse.json({ url: deploy.deploy_ssl_url || deploy.deploy_url || site.ssl_url || site.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur inconnue' }, { status: 500 });
  }
} 