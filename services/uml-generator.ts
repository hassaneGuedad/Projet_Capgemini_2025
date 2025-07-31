export interface UMLClass {
  name: string;
  properties: UMLProperty[];
  methods: UMLMethod[];
  extends?: string;
  implements?: string[];
  isInterface: boolean;
  isAbstract: boolean;
}

export interface UMLProperty {
  name: string;
  type: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic: boolean;
  isReadonly: boolean;
}

export interface UMLMethod {
  name: string;
  parameters: UMLParameter[];
  returnType: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic: boolean;
  isAsync: boolean;
}

export interface UMLParameter {
  name: string;
  type: string;
  isOptional: boolean;
}

export interface UMLRelationship {
  from: string;
  to: string;
  type: 'inheritance' | 'association' | 'composition' | 'aggregation' | 'dependency';
  label?: string;
}

export interface UMLData {
  classes: UMLClass[];
  relationships: UMLRelationship[];
  components: string[];
  functions: string[];
}

export class UMLGenerator {
  private classes: UMLClass[] = [];
  private relationships: UMLRelationship[] = [];
  private components: string[] = [];
  private functions: string[] = [];

  analyzeCode(files: any[]): UMLData {
    this.classes = [];
    this.relationships = [];
    this.components = [];
    this.functions = [];

    console.log('UML Generator - Starting analysis of', files.length, 'files');

    files.forEach((file, index) => {
      console.log(`UML Generator - Analyzing file ${index + 1}:`, file.name);
      if (file.content) {
        console.log(`UML Generator - File ${file.name} has content length:`, file.content.length);
        this.analyzeFile(file.content, file.name);
      } else {
        console.log(`UML Generator - File ${file.name} has no content`);
      }
    });

    console.log('UML Generator - Analysis complete:', {
      classes: this.classes.length,
      components: this.components.length,
      relationships: this.relationships.length,
      functions: this.functions.length
    });

    return {
      classes: this.classes,
      relationships: this.relationships,
      components: this.components,
      functions: this.functions
    };
  }

  private analyzeFile(content: string, fileName: string) {
    // Analyse basique du code pour extraire les classes, interfaces, etc.
    const lines = content.split('\n');
    let currentClass: UMLClass | null = null;
    let inClass = false;
    let braceCount = 0;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Détecter les classes Java
      const classMatch = trimmedLine.match(/^(public\s+)?(abstract\s+)?(final\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w\s,]+))?/);
      if (classMatch) {
        const className = classMatch[4];
        const extendsClass = classMatch[5];
        const implementsInterfaces = classMatch[6]?.split(',').map(i => i.trim()) || [];
        const isAbstract = !!classMatch[2];
        
        currentClass = {
          name: className,
          properties: [],
          methods: [],
          extends: extendsClass,
          implements: implementsInterfaces,
          isInterface: false,
          isAbstract
        };
        
        this.classes.push(currentClass);
        inClass = true;
        braceCount = 0;

        if (extendsClass) {
          this.relationships.push({
            from: className,
            to: extendsClass,
            type: 'inheritance'
          });
        }

        implementsInterfaces.forEach(interfaceName => {
          this.relationships.push({
            from: className,
            to: interfaceName,
            type: 'dependency',
            label: 'implements'
          });
        });
      }

      // Détecter les interfaces Java
      const interfaceMatch = trimmedLine.match(/^(public\s+)?interface\s+(\w+)(?:\s+extends\s+([\w\s,]+))?/);
      if (interfaceMatch) {
        const interfaceName = interfaceMatch[2];
        const extendsInterfaces = interfaceMatch[3]?.split(',').map(i => i.trim()) || [];
        
        currentClass = {
          name: interfaceName,
          properties: [],
          methods: [],
          extends: extendsInterfaces[0],
          implements: extendsInterfaces.slice(1),
          isInterface: true,
          isAbstract: false
        };
        
        this.classes.push(currentClass);
        inClass = true;
        braceCount = 0;

        extendsInterfaces.forEach(extendedInterface => {
          this.relationships.push({
            from: interfaceName,
            to: extendedInterface,
            type: 'inheritance'
          });
        });
      }

      // Détecter les enums Java
      const enumMatch = trimmedLine.match(/^(public\s+)?enum\s+(\w+)/);
      if (enumMatch) {
        const enumName = enumMatch[2];
        
        currentClass = {
          name: enumName,
          properties: [],
          methods: [],
          isInterface: false,
          isAbstract: false
        };
        
        this.classes.push(currentClass);
        inClass = true;
        braceCount = 0;
      }

      // Compter les accolades pour détecter la fin de classe
      if (inClass && currentClass) {
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        if (braceCount <= 0) {
          inClass = false;
          currentClass = null;
        }
      }

      // Détecter les propriétés Java
      if (inClass && currentClass) {
        // Propriétés privées, publiques, protégées
        const propertyMatch = trimmedLine.match(/^(private|public|protected|static|final)?\s*(?:static\s+|final\s+)*(\w+)\s+(\w+)\s*;?$/);
        if (propertyMatch && !trimmedLine.includes('(') && !trimmedLine.includes('{')) {
          const visibility = propertyMatch[1] as 'public' | 'private' | 'protected' || 'private';
          const propertyType = propertyMatch[2];
          const propertyName = propertyMatch[3];
          
          currentClass.properties.push({
            name: propertyName,
            type: propertyType,
            visibility,
            isStatic: trimmedLine.includes('static'),
            isReadonly: trimmedLine.includes('final')
          });
        }

        // Méthodes Java
        const methodMatch = trimmedLine.match(/^(private|public|protected)?\s*(?:static\s+|final\s+)*(\w+)\s+(\w+)\s*\(/);
        if (methodMatch && !trimmedLine.includes('class') && !trimmedLine.includes('interface')) {
          const visibility = methodMatch[1] as 'public' | 'private' | 'protected' || 'public';
          const returnType = methodMatch[2];
          const methodName = methodMatch[3];
          
          currentClass.methods.push({
            name: methodName,
            parameters: [],
            returnType,
            visibility,
            isStatic: trimmedLine.includes('static'),
            isAsync: false
          });
        }
      }

      // Détecter les composants React/TypeScript
      const componentMatch = line.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*\(/);
      if (componentMatch) {
        const componentName = componentMatch[1] || componentMatch[2];
        if (componentName && componentName[0] === componentName[0].toUpperCase()) {
          this.components.push(componentName);
        }
      }
    });
  }

  generateClassDiagram(data: UMLData): string {
    let mermaid = 'classDiagram\n';
    
    // Si aucune classe n'est trouvée, créer un diagramme d'exemple
    if (data.classes.length === 0) {
      mermaid += `    class ExampleClass {
        +String name
        +int id
        +getName() String
        +setName(name) void
    }
    
    class AnotherClass {
        -String description
        +getDescription() String
    }
    
    ExampleClass --> AnotherClass : uses`;
      return mermaid;
    }
    
    // Générer les classes
    data.classes.forEach(cls => {
      mermaid += `    class ${cls.name} {\n`;
      
      // Propriétés
      if (cls.properties.length > 0) {
        cls.properties.forEach(prop => {
          const visibility = prop.visibility === 'private' ? '-' : prop.visibility === 'protected' ? '#' : '+';
          const staticModifier = prop.isStatic ? '$' : '';
          const readonlyModifier = prop.isReadonly ? 'readonly ' : '';
          mermaid += `        ${visibility}${staticModifier}${readonlyModifier}${prop.name} : ${prop.type}\n`;
        });
      } else {
        // Ajouter une propriété par défaut si aucune n'est trouvée
        mermaid += `        +String name\n`;
      }
      
      // Méthodes
      if (cls.methods.length > 0) {
        cls.methods.forEach(method => {
          const visibility = method.visibility === 'private' ? '-' : method.visibility === 'protected' ? '#' : '+';
          const staticModifier = method.isStatic ? '$' : '';
          const asyncModifier = method.isAsync ? 'async ' : '';
          const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
          mermaid += `        ${visibility}${staticModifier}${asyncModifier}${method.name}(${params}) ${method.returnType}\n`;
        });
      } else {
        // Ajouter une méthode par défaut si aucune n'est trouvée
        mermaid += `        +get${cls.name}() ${cls.name}\n`;
      }
      
      mermaid += `    }\n\n`;
    });
    
    // Générer les relations
    if (data.relationships.length > 0) {
      data.relationships.forEach(rel => {
        switch (rel.type) {
          case 'inheritance':
            mermaid += `    ${rel.from} --|> ${rel.to}\n`;
            break;
          case 'association':
            mermaid += `    ${rel.from} --> ${rel.to} : ${rel.label || 'uses'}\n`;
            break;
          case 'composition':
            mermaid += `    ${rel.from} *-- ${rel.to}\n`;
            break;
          case 'aggregation':
            mermaid += `    ${rel.from} o-- ${rel.to}\n`;
            break;
          case 'dependency':
            mermaid += `    ${rel.from} ..> ${rel.to} : ${rel.label || 'depends'}\n`;
            break;
        }
      });
    } else if (data.classes.length > 1) {
      // Créer des relations par défaut entre les classes
      for (let i = 0; i < data.classes.length - 1; i++) {
        mermaid += `    ${data.classes[i].name} --> ${data.classes[i + 1].name} : uses\n`;
      }
    }
    
    return mermaid;
  }

  generateComponentDiagram(data: UMLData): string {
    let mermaid = 'graph TB\n';
    
    // Générer les composants
    data.components.forEach(component => {
      mermaid += `    ${component}[${component}]\n`;
    });
    
    // Générer les relations entre composants (basées sur les imports)
    data.classes.forEach(cls => {
      if (cls.name.endsWith('Component') || cls.name.endsWith('Page')) {
        cls.properties.forEach(prop => {
          if (prop.type.includes('Component') || prop.type.includes('Page')) {
            const targetComponent = prop.type.replace('[]', '').replace('Component', '').replace('Page', '');
            mermaid += `    ${cls.name} --> ${targetComponent}\n`;
          }
        });
      }
    });
    
    return mermaid;
  }

  generateSequenceDiagram(data: UMLData): string {
    let mermaid = 'sequenceDiagram\n';
    mermaid += `    participant User\n`;
    mermaid += `    participant App\n`;
    
    // Ajouter les composants principaux
    data.components.slice(0, 5).forEach(component => {
      mermaid += `    participant ${component}\n`;
    });
    
    // Générer un flux de base
    mermaid += `    User->>App: Interagit avec l'application\n`;
    mermaid += `    App->>${data.components[0] || 'Component'}: Appel du composant\n`;
    
    data.classes.forEach(cls => {
      if (cls.methods.length > 0) {
        const method = cls.methods[0];
        mermaid += `    ${cls.name}->>${cls.name}: ${method.name}()\n`;
      }
    });
    
    mermaid += `    ${data.components[0] || 'Component'}-->>App: Retour de données\n`;
    mermaid += `    App-->>User: Affichage du résultat\n`;
    
    return mermaid;
  }

  generateActivityDiagram(data: UMLData): string {
    let mermaid = 'flowchart TD\n';
    mermaid += `    A[Début] --> B[Initialisation]\n`;
    mermaid += `    B --> C{Utilisateur connecté?}\n`;
    mermaid += `    C -->|Oui| D[Charger les données]\n`;
    mermaid += `    C -->|Non| E[Rediriger vers login]\n`;
    mermaid += `    D --> F[Afficher l'interface]\n`;
    mermaid += `    F --> G{Action utilisateur}\n`;
    mermaid += `    G -->|Créer| H[Créer un élément]\n`;
    mermaid += `    G -->|Modifier| I[Modifier un élément]\n`;
    mermaid += `    G -->|Supprimer| J[Supprimer un élément]\n`;
    mermaid += `    H --> K[Sauvegarder]\n`;
    mermaid += `    I --> K\n`;
    mermaid += `    J --> K\n`;
    mermaid += `    K --> L[Actualiser l'affichage]\n`;
    mermaid += `    L --> G\n`;
    mermaid += `    E --> M[Fin]\n`;
    
    return mermaid;
  }

  generateERDiagram(data: UMLData): string {
    let mermaid = 'erDiagram\n';
    
    // Créer des entités basées sur les classes
    data.classes.forEach(cls => {
      if (!cls.isInterface && cls.properties.length > 0) {
        mermaid += `    ${cls.name} {\n`;
        cls.properties.forEach(prop => {
          const type = this.mapToDatabaseType(prop.type);
          mermaid += `        ${type} ${prop.name}\n`;
        });
        mermaid += `    }\n\n`;
      }
    });
    
    // Créer des relations basées sur les propriétés
    data.classes.forEach(cls => {
      cls.properties.forEach(prop => {
        if (prop.type.includes('[]') || prop.type.includes('List')) {
          const relatedClass = prop.type.replace('[]', '').replace('List<', '').replace('>', '');
          mermaid += `    ${cls.name} ||--o{ ${relatedClass} : "a plusieurs"\n`;
        }
      });
    });
    
    return mermaid;
  }

  private mapToDatabaseType(typescriptType: string): string {
    const typeMap: { [key: string]: string } = {
      'string': 'varchar',
      'number': 'int',
      'boolean': 'boolean',
      'Date': 'datetime',
      'string[]': 'varchar',
      'number[]': 'int'
    };
    
    return typeMap[typescriptType] || 'varchar';
  }
} 