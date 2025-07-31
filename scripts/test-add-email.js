// Script de test pour l'ajout d'email
// À exécuter dans la console du navigateur

async function testAddEmail() {
  console.log('🧪 Test d\'ajout d\'email...');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        company: 'Example Corp',
        role: 'Testeur'
      })
    });
    
    console.log('✅ Status:', response.status);
    const data = await response.json();
    console.log('✅ Response:', data);
    
    if (response.ok) {
      console.log('🎉 Email ajouté avec succès !');
    } else {
      console.log('❌ Erreur lors de l\'ajout:', data);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Fonction pour tester la récupération des emails
async function testGetEmails() {
  console.log('🧪 Test de récupération des emails...');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    console.log('✅ Status:', response.status);
    const data = await response.json();
    console.log('✅ Response:', data);
    
    if (response.ok) {
      console.log('📧 Emails récupérés:', data.emails.length);
      data.emails.forEach((email, index) => {
        console.log(`  ${index + 1}. ${email.email} (${email.company}) - ${email.addedAt}`);
      });
    } else {
      console.log('❌ Erreur lors de la récupération:', data);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.testAddEmail = testAddEmail;
  window.testGetEmails = testGetEmails;
  
  console.log('🧪 Scripts de test disponibles :');
  console.log('  - testAddEmail() : Test d\'ajout d\'email');
  console.log('  - testGetEmails() : Test de récupération des emails');
} 