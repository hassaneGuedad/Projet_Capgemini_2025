// Script pour tester directement le formulaire d'inscription
console.log('🧪 Test direct du formulaire d\'inscription...');

async function testFormDirectly() {
  try {
    console.log('\n🔍 === ÉTAPE 1: SIMULATION DU FORMULAIRE ===');
    
    // Simuler exactement ce que fait le formulaire
    const testEmail = 'gcluxurycar@gmail.com';
    const testPassword = 'testpassword123';
    
    console.log(`🔍 Simulation inscription avec: ${testEmail}`);
    console.log('🔍 Mode: INSCRIPTION');
    console.log('🔍 Timestamp:', new Date().toISOString());
    
    console.log('\n🔍 === ÉTAPE 2: VÉRIFICATION EMAIL ===');
    console.log('🔍 Appel API /api/auth/check-email...');
    
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    console.log('🔍 Status de la réponse:', checkResponse.status);
    const checkData = await checkResponse.json();
    console.log('🔍 Données de la réponse:', checkData);
    
    if (!checkResponse.ok) {
      console.log('❌ Erreur API vérification email:', checkData);
      return;
    }
    
    if (!checkData.isAuthorized) {
      console.log('❌ === EMAIL NON AUTORISÉ ===');
      console.log('❌ Email rejeté:', testEmail);
      console.log('❌ Le formulaire devrait afficher une erreur ici');
      console.log('❌ MAIS il semble que l\'erreur ne s\'affiche pas !');
      
      console.log('\n🔍 === ÉTAPE 3: DIAGNOSTIC ===');
      console.log('📋 Problèmes possibles:');
      console.log('1. L\'erreur est affichée mais invisible');
      console.log('2. Le formulaire se ferme avant l\'affichage');
      console.log('3. Il y a un problème de timing');
      console.log('4. L\'erreur est masquée par d\'autres éléments');
      console.log('5. Le formulaire continue malgré l\'erreur');
      
      console.log('\n🔍 === ÉTAPE 4: TEST MANUEL DÉTAILLÉ ===');
      console.log('📝 Instructions précises:');
      console.log('1. Ouvrez une fenêtre de navigation privée');
      console.log('2. Ouvrez la console (F12)');
      console.log('3. Allez sur votre site');
      console.log('4. Cliquez sur "Se connecter"');
      console.log('5. Cliquez sur "S\'inscrire"');
      console.log('6. Entrez gcluxurycar@gmail.com et un mot de passe');
      console.log('7. AVANT de cliquer sur "S\'inscrire", regardez la console');
      console.log('8. Cliquez sur "S\'inscrire"');
      console.log('9. Regardez IMMÉDIATEMENT la console pour les logs');
      console.log('10. Regardez l\'écran pour les messages d\'erreur');
      console.log('11. Notez si le formulaire se ferme ou reste ouvert');
      
      console.log('\n🔍 === ÉTAPE 5: LOGS À CHERCHER ===');
      console.log('📝 Vous devriez voir dans la console:');
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
      
      console.log('\n🔍 === ÉTAPE 6: QUESTIONS CRITIQUES ===');
      console.log('📝 Répondez à ces questions:');
      console.log('1. Voyez-vous TOUS les logs ci-dessus dans la console ?');
      console.log('2. Voyez-vous le message "❌ Affichage erreur:" ?');
      console.log('3. Voyez-vous un message d\'erreur rouge à l\'écran ?');
      console.log('4. Le formulaire reste-t-il ouvert après l\'erreur ?');
      console.log('5. Êtes-vous redirigé vers le dashboard malgré l\'erreur ?');
      console.log('6. L\'inscription réussit-elle malgré l\'erreur ?');
      
    } else {
      console.log('✅ === EMAIL AUTORISÉ ===');
      console.log('✅ Email accepté:', testEmail);
      console.log('❌ PROBLÈME: L\'API autorise un email qui ne devrait pas l\'être !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testFormDirectly(); 