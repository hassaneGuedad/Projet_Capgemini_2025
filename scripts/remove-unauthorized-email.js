// Script pour supprimer gcluxurycar@gmail.com de la liste autorisée
console.log('🗑️ Suppression de gcluxurycar@gmail.com de la liste autorisée...');

async function removeUnauthorizedEmail() {
  try {
    console.log('\n🔍 === ÉTAPE 1: VÉRIFICATION DE LA PRÉSENCE ===');
    
    // Récupérer la liste des emails autorisés
    const listResponse = await fetch('/api/admin/authorized-emails', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    const listData = await listResponse.json();
    console.log('📋 Emails autorisés actuels:', listData.emails?.map(e => e.email) || []);
    
    // Chercher gcluxurycar@gmail.com
    const targetEmail = 'gcluxurycar@gmail.com';
    const emailToRemove = listData.emails?.find(e => e.email.toLowerCase() === targetEmail.toLowerCase());
    
    if (emailToRemove) {
      console.log(`⚠️  ${targetEmail} trouvé dans la liste autorisée (ID: ${emailToRemove.id})`);
      
      console.log('\n🔍 === ÉTAPE 2: SUPPRESSION ===');
      console.log(`🗑️ Suppression de ${targetEmail}...`);
      
      const deleteResponse = await fetch(`/api/admin/authorized-emails/${emailToRemove.id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': 'scapworkspace@gmail.com'
        }
      });
      
      const deleteData = await deleteResponse.json();
      console.log('📋 Réponse de suppression:', deleteData);
      
      if (deleteResponse.ok) {
        console.log(`✅ ${targetEmail} supprimé avec succès!`);
      } else {
        console.log(`❌ Erreur lors de la suppression: ${deleteData.error}`);
      }
      
    } else {
      console.log(`✅ ${targetEmail} n'est PAS dans la liste autorisée`);
      console.log('💡 Aucune action nécessaire');
    }
    
    console.log('\n🔍 === ÉTAPE 3: VÉRIFICATION FINALE ===');
    
    // Vérifier que l'email est bien supprimé
    const finalCheckResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail })
    });
    
    const finalCheckData = await finalCheckResponse.json();
    console.log(`📋 Vérification finale de ${targetEmail}:`, finalCheckData);
    
    if (!finalCheckData.isAuthorized) {
      console.log(`✅ ${targetEmail} est maintenant correctement NON AUTORISÉ`);
    } else {
      console.log(`❌ PROBLÈME: ${targetEmail} est encore autorisé!`);
    }
    
    console.log('\n🔍 === ÉTAPE 4: TEST RECOMMANDÉ ===');
    console.log('📝 Pour confirmer que le système fonctionne:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Essayez de vous inscrire avec gcluxurycar@gmail.com');
    console.log('3. Vous devriez recevoir le message d\'erreur de restriction');
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
  }
}

// Exécuter la suppression
removeUnauthorizedEmail(); 