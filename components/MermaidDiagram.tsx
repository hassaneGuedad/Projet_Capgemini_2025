'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
  onRendered?: () => void;
}

export function MermaidDiagram({ chart, className = '', onRendered }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      // Configuration Mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        class: {
          useMaxWidth: true,
          htmlLabels: true
        },
                 sequence: {
           diagramMarginX: 50,
           diagramMarginY: 10,
           actorMargin: 50,
           width: 150,
           height: 65,
           boxMargin: 10,
           boxTextMargin: 5,
           noteMargin: 10,
           messageMargin: 35,
           mirrorActors: true,
           bottomMarginAdj: 1,
           useMaxWidth: true,
           rightAngles: false,
           showSequenceNumbers: false
         }
      });

      // Nettoyer le conteneur
      containerRef.current.innerHTML = '';

      // Générer le diagramme
      mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          console.log('✅ Diagramme Mermaid rendu avec succès');
          onRendered?.();
        }
      }).catch(error => {
        console.error('Erreur lors du rendu Mermaid:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="text-center p-8 text-gray-500">
              <div class="text-lg font-medium mb-2">Erreur de rendu</div>
              <div class="text-sm">Le diagramme ne peut pas être affiché</div>
              <div class="text-xs mt-2">${error.message}</div>
            </div>
          `;
        }
      });
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-diagram ${className}`}
      style={{ 
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
} 