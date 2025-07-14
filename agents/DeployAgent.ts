// Importation des dépendances nécessaires
// deployToNetlify: Service pour déployer sur Netlify
// JSZip: Bibliothèque pour créer des archives ZIP en JavaScript
// GeneratedFile: Type définissant la structure d'un fichier généré
import { deployToNetlify } from "@/services/netlify";
import JSZip from "jszip";
import { GeneratedFile } from "@/types/agents";

/**
 * DeployAgent - Agent responsable du déploiement des fichiers générés
 * 
 * @param files - Tableau d'objets GeneratedFile à déployer:
 *   - path: string - Le chemin du fichier dans l'archive
 *   - content: string - Le contenu du fichier
 * @param siteName - string - Le nom du site sur Netlify
 * 
 * @returns Promise<string> - Une promesse qui se résout avec l'URL du site déployé
 */
export async function DeployAgent(files: GeneratedFile[], siteName: string): Promise<string> {
  // Création d'une nouvelle instance JSZip pour créer une archive
  const zip = new JSZip();
  
  // Ajout de chaque fichier à l'archive ZIP
  // - file.path: Le chemin relatif dans l'archive
  // - file.content: Le contenu du fichier
  files.forEach(file => {
    zip.file(file.path, file.content);
  });
  
  // Génération du buffer de l'archive ZIP de manière asynchrone
  // - type: "nodebuffer" spécifie que nous voulons un Buffer Node.js
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  
  // Déploiement de l'archive sur Netlify et retour de l'URL du site
  return await deployToNetlify(zipBuffer, siteName);
}