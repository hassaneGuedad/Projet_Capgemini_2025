// Script de test pour vérifier l'email problématique
console.log('🔍 Test de vérification d\'email...');

async function testEmailCheck(email) {
  try {
    console.log(`🔍 Test de l'email: ${email}`);
    
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    console.log(`📋 Réponse pour ${email}:`, data);
    
    if (response.ok) {
      console.log(`✅ ${email} - Autorisé: ${data.isAuthorized}`);
    } else {
      console.log(`❌ ${email} - Erreur: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Erreur pour ${email}:`, error);
    return null;
  }
}

// Test des emails
async function runTests() {
  console.log('🧪 Début des tests...');
  
  // Test 1: Email problématique
  await testEmailCheck('gcluxurycar@gmail.com');
  
  // Test 2: Email autorisé (pour comparaison)
  await testEmailCheck('hassaneemsi1@gmail.com');
  
  // Test 3: Email non autorisé
  await testEmailCheck('test@unauthorized.com');
  
  console.log('✅ Tests terminés');
}

// Exécuter les tests
runTests(); 