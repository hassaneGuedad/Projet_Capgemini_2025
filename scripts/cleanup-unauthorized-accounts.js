// Script pour nettoyer les comptes non autorisés et tester le système
console.log('🧹 Nettoyage des comptes non autorisés...');

async function cleanupAndTest() {
  try {
    console.log('\n🔍 === ÉTAPE 1: VÉRIFICATION DES EMAILS AUTORISÉS ===');
    
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
    
    // Liste des emails autorisés
    const authorizedEmails = listData.emails?.map(e => e.email.toLowerCase()) || [];
    
    console.log('\n🔍 === ÉTAPE 2: TEST DES EMAILS PROBLÉMATIQUES ===');
    
    // Test des emails problématiques
    const testEmails = [
      'gcluxurycar@gmail.com',
      'hassaneemsi1@gmail.com',
      'test@unauthorized.com'
    ];
    
    for (const email of testEmails) {
      console.log(`\n🔍 Test de ${email}:`);
      
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      const isAuthorized = data.isAuthorized;
      const shouldBeAuthorized = authorizedEmails.includes(email.toLowerCase());
      
      console.log(`📋 Résultat API: ${isAuthorized ? 'AUTORISÉ' : 'NON AUTORISÉ'}`);
      console.log(`📋 Devrait être: ${shouldBeAuthorized ? 'AUTORISÉ' : 'NON AUTORISÉ'}`);
      
      if (isAuthorized === shouldBeAuthorized) {
        console.log(`✅ CORRECT: ${email}`);
      } else {
        console.log(`❌ PROBLÈME: ${email} - Incohérence détectée!`);
      }
    }
    
    console.log('\n🔍 === ÉTAPE 3: RECOMMANDATIONS ===');
    
    if (authorizedEmails.includes('gcluxurycar@gmail.com')) {
      console.log('⚠️  gcluxurycar@gmail.com est dans la liste autorisée');
      console.log('💡 Si ce compte ne devrait pas être autorisé, supprimez-le via le panel admin');
    } else {
      console.log('✅ gcluxurycar@gmail.com n\'est PAS dans la liste autorisée');
      console.log('💡 Le système devrait bloquer ce compte lors de l\'inscription/connexion');
    }
    
    console.log('\n🔍 === ÉTAPE 4: TEST MANUEL RECOMMANDÉ ===');
    console.log('📝 Pour tester complètement le système:');
    console.log('1. Ouvrez une fenêtre de navigation privée');
    console.log('2. Essayez de vous inscrire avec gcluxurycar@gmail.com');
    console.log('3. Vérifiez que vous recevez le message d\'erreur de restriction');
    console.log('4. Essayez de vous connecter avec un email non autorisé');
    console.log('5. Vérifiez que vous recevez le message d\'erreur de restriction');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage et les tests
cleanupAndTest(); 