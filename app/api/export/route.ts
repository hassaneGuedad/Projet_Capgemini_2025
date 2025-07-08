import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  try {
    const { files, projectName = 'generated-project' } = await req.json();
    
    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Fichiers manquants ou invalides.' }, { status: 400 });
    }

    const zip = new JSZip();
    
    // Ajouter chaque fichier au ZIP
    files.forEach((file: any) => {
      // Utilise file.content si présent, sinon file.description
      const fileContent = file.content || file.description || '';
      zip.file(file.path, fileContent);
    });

    // Générer le ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Retourner le fichier ZIP
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName}.zip"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la génération du ZIP.' }, { status: 500 });
  }
} 