/**
 * InteractionAgent - Agent responsable des interactions avec l'utilisateur
 * 
 * @param question - string - La question ou la demande de clarification à adresser à l'utilisateur
 * 
 * @returns Promise<string> - Une promesse qui se résout avec la réponse de l'utilisateur
 * 
 * @description
 * Cet agent est conçu pour gérer les interactions avec l'utilisateur lorsqu'une clarification est nécessaire.
 * Dans son implémentation actuelle, il retourne simplement la question sans modification,
 * mais il est prévu pour être étendu avec une intégration à un système de chat ou d'UI interactif.
 * 
 * Cas d'utilisation typiques :
 * - Demander des précisions sur une exigence floue
 * - Confirmer une action potentiellement destructrice
 * - Résoudre des ambiguïtés dans les entrées utilisateur
 */
export async function InteractionAgent(question: string): Promise<string> {
    // TODO: Implémenter l'intégration avec un système de chat ou d'UI interactif
    // Actuellement, cette implémentation de base retourne simplement la question
    // Dans une version complète, cette fonction pourrait :
    // 1. Afficher une boîte de dialogue modale dans l'UI
    // 2. Attendre la réponse de l'utilisateur
    // 3. Retourner cette réponse pour traitement ultérieur
    
    return question;
}