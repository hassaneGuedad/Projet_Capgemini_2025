// Script de test pour Google Sign-In
console.log('🧪 Test de la vérification Google Sign-In...');

async function testGoogleSignInVerification() {
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
    
    console.log('\n🔍 === ÉTAPE 2: TEST DES EMAILS GOOGLE ===');
    
    // Test des emails qui pourraient être utilisés avec Google
    const testEmails = [
      { email: 'gcluxurycar@gmail.com', shouldBeAuthorized: false, description: 'Compte problématique' },
      { email: 'scapworkspace@gmail.com', shouldBeAuthorized: true, description: 'Admin' },
      { email: 'hassaneemsi1@gmail.com', shouldBeAuthorized: true, description: 'Stagiaire' },
      { email: 'test@gmail.com', shouldBeAuthorized: false, description: 'Email aléatoire' }
    ];
    
    for (const test of testEmails) {
      console.log(`\n🔍 Test Google Sign-In: ${test.email} (${test.description})`);
      
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
        console.log(`✅ CORRECT: ${test.email} sera ${isAuthorized ? 'autorisé' : 'bloqué'} avec Google Sign-In`);
      } else {
        console.log(`❌ PROBLÈME: ${test.email} - Incohérence détectée!`);
      }
    }
    
    console.log('\n🔍 === ÉTAPE 3: RECOMMANDATIONS ===');
    
    if (authorizedEmails.includes('gcluxurycar@gmail.com')) {
      console.log('⚠️  gcluxurycar@gmail.com est dans la liste autorisée');
      console.log('💡 Supprimez-le via le panel admin s\'il ne devrait pas être autorisé');
    } else {
      console.log('✅ gcluxurycar@gmail.com n\'est PAS dans la liste autorisée');
      console.log('💡 Le système devrait bloquer ce compte avec Google Sign-In');
    }
    
    console.log('\n🔍 === ÉTAPE 4: TEST MANUEL GOOGLE SIGN-IN ===');
    console.log('📝 Pour tester Google Sign-In:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Cliquez sur "Se connecter avec Google"');
    console.log('3. Connectez-vous avec gcluxurycar@gmail.com');
    console.log('4. Vous devriez voir les logs détaillés dans la console');
    console.log('5. Le système devrait bloquer la connexion et afficher un message d\'erreur');
    console.log('6. Essayez avec scapworkspace@gmail.com - devrait réussir');
    
    console.log('\n🔍 === ÉTAPE 5: VÉRIFICATION DES LOGS ===');
    console.log('📝 Lors du test Google Sign-In, vous devriez voir:');
    console.log('- 🔍 === DÉBUT GOOGLE SIGN-IN ===');
    console.log('- 🔍 === VÉRIFICATION EMAIL GOOGLE ===');
    console.log('- ❌ === EMAIL GOOGLE NON AUTORISÉ === (si email non autorisé)');
    console.log('- ✅ === EMAIL GOOGLE AUTORISÉ === (si email autorisé)');
    
  } catch (error) {
    console.error('❌ Erreur lors du test Google Sign-In:', error);
  }
}

// Exécuter le test
testGoogleSignInVerification(); 