// Script de débogage pour l'API
// À exécuter dans la console du navigateur

async function debugAPI() {
  console.log('🔍 Débogage de l\'API...');
  
  // Test 1: Vérifier si l'API est accessible
  console.log('\n📧 Test 1: Accessibilité de l\'API');
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('✅ Data:', data);
    
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
  
  // Test 2: Test avec email vide
  console.log('\n📧 Test 2: Email vide');
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' })
    });
    
    console.log('✅ Status:', response.status);
    const data = await response.json();
    console.log('✅ Data:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  // Test 3: Test sans email
  console.log('\n📧 Test 3: Sans email');
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    console.log('✅ Status:', response.status);
    const data = await response.json();
    console.log('✅ Data:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  // Test 4: Test avec email invalide
  console.log('\n📧 Test 4: Email invalide');
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    
    console.log('✅ Status:', response.status);
    const data = await response.json();
    console.log('✅ Data:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test de l'URL de l'API
function testAPIURL() {
  console.log('🔍 Test de l\'URL de l\'API...');
  
  const apiUrl = '/api/auth/check-email';
  console.log('📧 URL testée:', apiUrl);
  console.log('📧 URL complète:', window.location.origin + apiUrl);
  
  // Vérifier si l'URL est accessible
  fetch(apiUrl, { method: 'OPTIONS' })
    .then(response => {
      console.log('✅ OPTIONS Status:', response.status);
    })
    .catch(error => {
      console.error('❌ OPTIONS Error:', error);
    });
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.debugAPI = debugAPI;
  window.testAPIURL = testAPIURL;
  
  console.log('🔍 Scripts de débogage disponibles :');
  console.log('  - debugAPI() : Test complet de l\'API');
  console.log('  - testAPIURL() : Test de l\'URL de l\'API');
} 