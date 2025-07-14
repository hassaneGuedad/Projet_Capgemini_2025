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
      form.append(file.path, new Blob([file.description || ''], { type: 'text/plain' }), file.name);
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