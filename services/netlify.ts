import axios from "axios";

/**
 * NetlifySiteResponse - Interface pour la réponse de l'API Netlify lors de la création d'un site
 * @property {string} site_id - Identifiant unique du site créé sur Netlify
 */
type NetlifySiteResponse = { site_id: string };

// Récupération du token d'API Netlify depuis les variables d'environnement
// Note: L'opérateur '!' indique que cette variable est requise
const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN!;

/**
 * Déploie une archive ZIP sur Netlify et retourne l'URL du site déployé
 * 
 * @param {Buffer} zipBuffer - Le contenu binaire de l'archive ZIP à déployer
 * @param {string} siteName - Le nom souhaité pour le site Netlify (sera utilisé dans l'URL)
 * @returns {Promise<string>} L'URL du site déployé sur Netlify
 * 
 * @example
 * const zipBuffer = fs.readFileSync('mon-projet.zip');
 * const url = await deployToNetlify(zipBuffer, 'mon-projet');
 * console.log(`Site déployé à l'adresse : ${url}`);
 */
export async function deployToNetlify(zipBuffer: Buffer, siteName: string): Promise<string> {
  // Étape 1: Création d'un nouveau site sur Netlify
  const res = await axios.post(
    "https://api.netlify.com/api/v1/sites",
    { name: siteName },
    { 
      headers: { 
        Authorization: `Bearer ${NETLIFY_TOKEN}` 
      } 
    }
  );
  
  // Récupération de l'ID du site créé
  const data = res.data as NetlifySiteResponse;
  const siteId = data.site_id;

  // Étape 2: Déploiement du contenu ZIP sur le site créé
  await axios.post(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
    zipBuffer,  // Contenu binaire de l'archive ZIP
    {
      headers: {
        Authorization: `Bearer ${NETLIFY_TOKEN}`,
        "Content-Type": "application/zip"  // Important pour indiquer qu'on envoie un fichier ZIP
      }
    }
  );
  
  // Retourne l'URL complète du site déployé
  return `https://${siteName}.netlify.app`;
}