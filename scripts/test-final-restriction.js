// Script de test final pour vérifier le système de restriction
console.log('🧪 Test final du système de restriction d\'accès...');

async function testFinalRestriction() {
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
    
    console.log('\n🔍 === ÉTAPE 2: TEST DES EMAILS ===');
    
    const testEmails = [
      { email: 'scapworkspace@gmail.com', shouldBeAuthorized: true, description: 'Admin' },
      { email: 'hassan15guedad@gmail.com', shouldBeAuthorized: true, description: 'Chef Projet' },
      { email: 'hassaneemsi1@gmail.com', shouldBeAuthorized: true, description: 'Stagiaire' },
      { email: 'gcluxurycar@gmail.com', shouldBeAuthorized: false, description: 'Compte problématique' },
      { email: 'test@unauthorized.com', shouldBeAuthorized: false, description: 'Email aléatoire' }
    ];
    
    let allTestsPassed = true;
    
    for (const test of testEmails) {
      console.log(`\n🔍 Test: ${test.email} (${test.description})`);
      
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
        console.log(`✅ CORRECT: ${test.email}`);
      } else {
        console.log(`❌ PROBLÈME: ${test.email} - Incohérence détectée!`);
        allTestsPassed = false;
      }
    }
    
    console.log('\n🔍 === ÉTAPE 3: RÉSUMÉ ===');
    
    if (allTestsPassed) {
      console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('✅ Le système de restriction fonctionne correctement');
      console.log('✅ L\'API bloque les emails non autorisés');
      console.log('✅ L\'API autorise les emails autorisés');
    } else {
      console.log('❌ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('⚠️  Il y a des incohérences dans le système');
    }
    
    console.log('\n🔍 === ÉTAPE 4: RECOMMANDATIONS FINALES ===');
    
    if (authorizedEmails.includes('gcluxurycar@gmail.com')) {
      console.log('⚠️  gcluxurycar@gmail.com est dans la liste autorisée');
      console.log('💡 Supprimez-le via le panel admin s\'il ne devrait pas être autorisé');
    } else {
      console.log('✅ gcluxurycar@gmail.com n\'est PAS dans la liste autorisée');
      console.log('💡 Le système devrait maintenant bloquer ce compte');
    }
    
    console.log('\n🔍 === ÉTAPE 5: TEST MANUEL RECOMMANDÉ ===');
    console.log('📝 Pour confirmer le fonctionnement:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Essayez de vous inscrire avec gcluxurycar@gmail.com');
    console.log('3. Vous devriez recevoir le message d\'erreur de restriction');
    console.log('4. Essayez de vous connecter avec un email non autorisé');
    console.log('5. Vous devriez recevoir le message d\'erreur de restriction');
    console.log('6. Essayez de vous connecter avec hassaneemsi1@gmail.com');
    console.log('7. La connexion devrait réussir');
    
  } catch (error) {
    console.error('❌ Erreur lors du test final:', error);
  }
}

// Exécuter le test final
testFinalRestriction(); 