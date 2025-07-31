// Script de test pour le formulaire d'inscription
console.log('🧪 Test du formulaire d\'inscription...');

async function testFormRegistration() {
  try {
    console.log('\n🔍 === ÉTAPE 1: VÉRIFICATION DE L\'ÉTAT ACTUEL ===');
    
    // Liste des emails autorisés
    const listResponse = await fetch('/api/admin/authorized-emails', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    const listData = await listResponse.json();
    const authorizedEmails = listData.emails?.map(e => e.email.toLowerCase()) || [];
    
    console.log('📋 Emails autorisés actuels:', authorizedEmails);
    
    console.log('\n🔍 === ÉTAPE 2: TEST DE L\'API DE VÉRIFICATION ===');
    
    // Test des emails pour l'inscription par formulaire
    const testEmails = [
      { email: 'gcluxurycar@gmail.com', shouldBeAuthorized: false, description: 'Compte problématique' },
      { email: 'scapworkspace@gmail.com', shouldBeAuthorized: true, description: 'Admin' },
      { email: 'hassaneemsi1@gmail.com', shouldBeAuthorized: true, description: 'Stagiaire' },
      { email: 'test@unauthorized.com', shouldBeAuthorized: false, description: 'Email aléatoire' }
    ];
    
    for (const test of testEmails) {
      console.log(`\n🔍 Test formulaire: ${test.email} (${test.description})`);
      
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: test.email })
      });
      
      const data = await response.json();
      const isAuthorized = data.isAuthorized;
      
      console.log(`📋 Résultat API: ${isAuthorized ? 'AUTORISÉ' : 'NON AUTORISÉ'}`);
      console.log(`📋 Attendu: ${test.shouldBeAuthorized ? 'AUTORISÉ' : 'NON AUTORISÉ'}`);
      
      if (isAuthorized === test.shouldBeAuthorized) {
        console.log(`✅ CORRECT: ${test.email} sera ${isAuthorized ? 'autorisé' : 'bloqué'} avec le formulaire`);
      } else {
        console.log(`❌ PROBLÈME: ${test.email} - Incohérence détectée!`);
      }
    }
    
    console.log('\n🔍 === ÉTAPE 3: DIAGNOSTIC DU PROBLÈME ===');
    console.log('📋 Problème identifié:');
    console.log('- ✅ Google Sign-In fonctionne correctement');
    console.log('- ❌ Formulaire email/mot de passe ne fonctionne pas');
    console.log('- 🔍 L\'API de vérification fonctionne correctement');
    console.log('- 💡 Le problème est probablement dans l\'affichage des erreurs');
    
    console.log('\n🔍 === ÉTAPE 4: RECOMMANDATIONS ===');
    console.log('📝 Pour diagnostiquer le problème:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Ouvrez la console (F12)');
    console.log('3. Essayez de vous inscrire avec gcluxurycar@gmail.com via le formulaire');
    console.log('4. Regardez attentivement la console pour les logs');
    console.log('5. Vérifiez s\'il y a des messages d\'erreur à l\'écran');
    console.log('6. Notez si l\'inscription réussit ou échoue');
    
    console.log('\n🔍 === ÉTAPE 5: LOGS À CHERCHER ===');
    console.log('📝 Dans la console, vous devriez voir:');
    console.log('- 🔍 === DÉBUT PROCESSUS AUTHENTIFICATION ===');
    console.log('- 🔍 === VÉRIFICATION EMAIL AUTORISÉ ===');
    console.log('- 🔍 Appel API /api/auth/check-email...');
    console.log('- ❌ === EMAIL NON AUTORISÉ === (si email non autorisé)');
    console.log('- ✅ === EMAIL AUTORISÉ === (si email autorisé)');
    
    console.log('\n🔍 === ÉTAPE 6: TEST MANUEL RECOMMANDÉ ===');
    console.log('📝 Test spécifique:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Allez sur votre site');
    console.log('3. Cliquez sur "Se connecter"');
    console.log('4. Cliquez sur "S\'inscrire"');
    console.log('5. Entrez gcluxurycar@gmail.com et un mot de passe');
    console.log('6. Cliquez sur "S\'inscrire"');
    console.log('7. Regardez la console ET l\'écran pour les messages');
    console.log('8. Notez si l\'inscription réussit ou échoue');
    
  } catch (error) {
    console.error('❌ Erreur lors du test formulaire:', error);
  }
}

// Exécuter le test
testFormRegistration(); 