import { NextRequest, NextResponse } from 'next/server';
import { UMLGenerator } from '../../../../services/uml-generator';

export async function POST(request: NextRequest) {
  try {
    const { files, diagramType } = await request.json();

    console.log('UML API - Diagram type:', diagramType);
    console.log('UML API - Files received:', files?.length || 0);
    console.log('UML API - File names:', files?.map((f: any) => f.name) || []);

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: 'Files array is required' },
        { status: 400 }
      );
    }

    if (!diagramType) {
      return NextResponse.json(
        { error: 'Diagram type is required' },
        { status: 400 }
      );
    }

    // Vérifier le contenu des fichiers
    files.forEach((file, index) => {
      console.log(`UML API - File ${index + 1}:`, {
        name: file.name,
        contentLength: file.content?.length || 0,
        hasContent: !!file.content,
        contentPreview: file.content?.substring(0, 100) + '...'
      });
    });

    const generator = new UMLGenerator();
    const umlData = generator.analyzeCode(files);
    
    console.log('UML API - Analysis result:', {
      classes: umlData.classes.length,
      components: umlData.components.length,
      relationships: umlData.relationships.length,
      functions: umlData.functions.length
    });

    let diagram = '';
    let diagramName = '';

    switch (diagramType) {
      case 'class':
        diagram = generator.generateClassDiagram(umlData);
        diagramName = 'Diagramme de Classes';
        break;
      case 'component':
        diagram = generator.generateComponentDiagram(umlData);
        diagramName = 'Diagramme de Composants';
        break;
      case 'sequence':
        diagram = generator.generateSequenceDiagram(umlData);
        diagramName = 'Diagramme de Séquence';
        break;
      case 'activity':
        diagram = generator.generateActivityDiagram(umlData);
        diagramName = 'Diagramme d\'Activité';
        break;
      case 'er':
        diagram = generator.generateERDiagram(umlData);
        diagramName = 'Diagramme Entité-Relation';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid diagram type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      diagram,
      diagramName,
      data: umlData,
      stats: {
        classes: umlData.classes.length,
        components: umlData.components.length,
        relationships: umlData.relationships.length,
        functions: umlData.functions.length
      }
    });

  } catch (error) {
    console.error('Error generating UML diagram:', error);
    return NextResponse.json(
      { error: 'Failed to generate UML diagram' },
      { status: 500 }
    );
  }
} 