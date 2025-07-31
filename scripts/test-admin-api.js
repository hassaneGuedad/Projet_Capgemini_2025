// Script de test pour l'API d'administration
// À exécuter dans la console du navigateur

async function testAdminAPI() {
  console.log('🧪 Test de l\'API d\'administration...');
  
  // Test 1: Accès avec email admin
  console.log('\n📧 Test 1: Accès avec email admin (scapworkspace@gmail.com)');
  try {
    const response1 = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    const data1 = await response1.json();
    console.log('✅ Status:', response1.status);
    console.log('✅ Data:', data1);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  // Test 2: Accès avec email non-admin
  console.log('\n📧 Test 2: Accès avec email non-admin (test@example.com)');
  try {
    const response2 = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'test@example.com'
      }
    });
    const data2 = await response2.json();
    console.log('✅ Status:', response2.status);
    console.log('✅ Data:', data2);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  // Test 3: Accès sans header
  console.log('\n📧 Test 3: Accès sans header x-user-email');
  try {
    const response3 = await fetch('/api/admin/authorized-emails');
    const data3 = await response3.json();
    console.log('✅ Status:', response3.status);
    console.log('✅ Data:', data3);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test d'ajout d'email avec admin
async function testAddEmail() {
  console.log('\n🧪 Test d\'ajout d\'email avec admin...');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      },
      body: JSON.stringify({
        email: 'test@capgemini.com',
        company: 'Capgemini Test',
        role: 'Testeur'
      })
    });
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Data:', data);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.testAdminAPI = testAdminAPI;
  window.testAddEmail = testAddEmail;
  
  console.log('🧪 Scripts de test disponibles :');
  console.log('  - testAdminAPI() : Test des accès API');
  console.log('  - testAddEmail() : Test d\'ajout d\'email');
} 