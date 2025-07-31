// Script de débogage pour le problème du formulaire d'inscription
console.log('🔍 Débogage du problème du formulaire d\'inscription...');

async function debugFormIssue() {
  try {
    console.log('\n🔍 === ÉTAPE 1: ANALYSE DU PROBLÈME ===');
    console.log('📋 Problème identifié:');
    console.log('- ✅ Google Sign-In: Fonctionne correctement (bloque les emails non autorisés)');
    console.log('- ❌ Formulaire email/mot de passe: Ne fonctionne pas (permet l\'inscription)');
    console.log('- 🔍 API de vérification: Fonctionne correctement');
    console.log('- 💡 Le problème est dans l\'affichage des erreurs ou la logique du formulaire');
    
    console.log('\n🔍 === ÉTAPE 2: TEST DE L\'API ===');
    
    // Test direct de l'API
    const testEmail = 'gcluxurycar@gmail.com';
    console.log(`🔍 Test direct de l'API avec: ${testEmail}`);
    
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const data = await response.json();
    console.log(`📋 Status: ${response.status}`);
    console.log(`📋 Réponse:`, data);
    
    if (!data.isAuthorized) {
      console.log('✅ L\'API bloque correctement gcluxurycar@gmail.com');
      console.log('💡 Le problème est dans le formulaire, pas dans l\'API');
    } else {
      console.log('❌ L\'API autorise gcluxurycar@gmail.com - PROBLÈME DANS L\'API');
    }
    
    console.log('\n🔍 === ÉTAPE 3: HYPOTHÈSES ===');
    console.log('📋 Causes possibles:');
    console.log('1. L\'erreur n\'est pas affichée à l\'écran');
    console.log('2. Le formulaire se ferme avant l\'affichage de l\'erreur');
    console.log('3. L\'utilisateur ne voit pas le message d\'erreur');
    console.log('4. Il y a un problème de timing dans l\'affichage');
    console.log('5. L\'erreur est masquée par d\'autres éléments');
    
    console.log('\n🔍 === ÉTAPE 4: TEST MANUEL DÉTAILLÉ ===');
    console.log('📝 Instructions de test:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Ouvrez la console (F12)');
    console.log('3. Allez sur votre site');
    console.log('4. Cliquez sur "Se connecter"');
    console.log('5. Cliquez sur "S\'inscrire"');
    console.log('6. Entrez gcluxurycar@gmail.com et un mot de passe');
    console.log('7. Cliquez sur "S\'inscrire"');
    console.log('8. Regardez ATTENTIVEMENT:');
    console.log('   - La console pour les logs');
    console.log('   - L\'écran pour les messages d\'erreur');
    console.log('   - Si le formulaire se ferme');
    console.log('   - Si vous êtes redirigé vers le dashboard');
    
    console.log('\n🔍 === ÉTAPE 5: LOGS À CHERCHER ===');
    console.log('📝 Dans la console, vous devriez voir:');
    console.log('- 🔍 === DÉBUT PROCESSUS AUTHENTIFICATION ===');
    console.log('- 🔍 Email: gcluxurycar@gmail.com');
    console.log('- 🔍 Mode: INSCRIPTION');
    console.log('- 🔍 === VÉRIFICATION EMAIL AUTORISÉ ===');
    console.log('- 🔍 Appel API /api/auth/check-email...');
    console.log('- 🔍 Status de la réponse: 200');
    console.log('- 🔍 Données de la réponse: {success: true, isAuthorized: false, email: "gcluxurycar@gmail.com"}');
    console.log('- ❌ === EMAIL NON AUTORISÉ ===');
    console.log('- ❌ Email rejeté: gcluxurycar@gmail.com');
    console.log('- ❌ Affichage erreur: [message d\'erreur]');
    
    console.log('\n🔍 === ÉTAPE 6: QUESTIONS DE DIAGNOSTIC ===');
    console.log('📝 Répondez à ces questions:');
    console.log('1. Voyez-vous les logs dans la console ?');
    console.log('2. Voyez-vous un message d\'erreur à l\'écran ?');
    console.log('3. Le formulaire se ferme-t-il après l\'erreur ?');
    console.log('4. Êtes-vous redirigé vers le dashboard ?');
    console.log('5. L\'inscription réussit-elle malgré l\'erreur ?');
    
    console.log('\n🔍 === ÉTAPE 7: SOLUTION TEMPORAIRE ===');
    console.log('📝 En attendant de résoudre le problème:');
    console.log('- Utilisez Google Sign-In qui fonctionne correctement');
    console.log('- Ou ajoutez temporairement gcluxurycar@gmail.com à la liste autorisée');
    console.log('- Puis supprimez-le après avoir résolu le problème');
    
  } catch (error) {
    console.error('❌ Erreur lors du débogage:', error);
  }
}

// Exécuter le débogage
debugFormIssue(); 