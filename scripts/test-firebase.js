// Script de test Firebase
// À exécuter dans la console du navigateur

async function testFirebaseConnection() {
  console.log('🧪 Test de la connexion Firebase...');
  
  try {
    // Test 1: Vérifier si Firebase est initialisé
    console.log('\n📧 Test 1: Vérification Firebase');
    const response1 = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    console.log('✅ Status:', response1.status);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Data:', data1);
    } else {
      const error1 = await response1.json();
      console.log('❌ Error:', error1);
    }
    
    // Test 2: Ajouter un email de test
    console.log('\n📧 Test 2: Ajout d\'email de test');
    const response2 = await fetch('/api/admin/authorized-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      },
      body: JSON.stringify({
        email: 'test@firebase.com',
        company: 'Firebase Test',
        role: 'Testeur'
      })
    });
    console.log('✅ Status:', response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Data:', data2);
    } else {
      const error2 = await response2.json();
      console.log('❌ Error:', error2);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Fonction disponible dans la console
if (typeof window !== 'undefined') {
  window.testFirebaseConnection = testFirebaseConnection;
  
  console.log('🧪 Script de test Firebase disponible :');
  console.log('  - testFirebaseConnection() : Test de la connexion Firebase');
} 