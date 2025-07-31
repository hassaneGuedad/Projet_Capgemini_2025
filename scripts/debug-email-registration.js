// Script de débogage pour l'inscription d'email
console.log('🔍 Débogage du processus d\'inscription...');

async function debugEmailRegistration() {
  try {
    // Test 1: Vérifier l'API de vérification
    console.log('\n🧪 Test 1: Vérification API');
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
      console.log(`📋 Status: ${response.status}`);
      console.log(`📋 Réponse:`, data);
      
      if (response.ok) {
        console.log(`✅ ${email} - Autorisé: ${data.isAuthorized}`);
      } else {
        console.log(`❌ ${email} - Erreur: ${data.error}`);
      }
    }
    
    // Test 2: Vérifier la liste des emails autorisés
    console.log('\n🧪 Test 2: Liste des emails autorisés');
    const listResponse = await fetch('/api/admin/authorized-emails', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    const listData = await listResponse.json();
    console.log('📋 Liste des emails autorisés:', listData);
    
    // Test 3: Simuler une tentative d'inscription
    console.log('\n🧪 Test 3: Simulation d\'inscription non autorisée');
    console.log('⚠️  Cette simulation va tester le processus d\'inscription...');
    
    // Note: On ne fait pas vraiment l'inscription, juste la vérification
    const unauthorizedEmail = 'test@unauthorized.com';
    console.log(`🔍 Simulation d'inscription pour: ${unauthorizedEmail}`);
    
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: unauthorizedEmail })
    });
    
    const checkData = await checkResponse.json();
    console.log(`📋 Résultat de la vérification:`, checkData);
    
    if (checkData.isAuthorized) {
      console.log('❌ PROBLÈME: Email non autorisé détecté comme autorisé!');
    } else {
      console.log('✅ CORRECT: Email non autorisé correctement bloqué');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du débogage:', error);
  }
}

// Exécuter le débogage
debugEmailRegistration(); 