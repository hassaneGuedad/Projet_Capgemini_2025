// Script de test pour vérifier la restriction d'email
// À exécuter dans la console (F12)

console.log('🧪 Test de la restriction d\'email...');

// Test 1: Vérifier l'admin
async function testAdminEmail() {
  console.log('\n🔍 Test 1: Email admin (scapworkspace@gmail.com)');
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'scapworkspace@gmail.com' })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (data.isAuthorized) {
      console.log('✅ Admin autorisé (correct)');
    } else {
      console.log('❌ Admin non autorisé (problème)');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test 2: Vérifier un email non autorisé
async function testUnauthorizedEmail() {
  console.log('\n🔍 Test 2: Email non autorisé (test@example.com)');
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (!data.isAuthorized) {
      console.log('✅ Email non autorisé (correct)');
    } else {
      console.log('❌ Email autorisé (problème)');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test 3: Vérifier un email avec un domaine différent
async function testDifferentDomain() {
  console.log('\n🔍 Test 3: Email domaine différent (hacker@gmail.com)');
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hacker@gmail.com' })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (!data.isAuthorized) {
      console.log('✅ Email non autorisé (correct)');
    } else {
      console.log('❌ Email autorisé (problème)');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test 4: Simuler une tentative d'inscription
async function testRegistrationAttempt() {
  console.log('\n🔍 Test 4: Simulation d\'inscription (test@example.com)');
  
  try {
    // Simuler la vérification d'email lors de l'inscription
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    const checkData = await checkResponse.json();
    console.log('📋 Vérification email:', checkData);
    
    if (!checkData.isAuthorized) {
      console.log('✅ Inscription bloquée (correct)');
      console.log('💡 L\'utilisateur devrait voir un message d\'erreur');
    } else {
      console.log('❌ Inscription autorisée (problème)');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Test 5: Lister tous les emails autorisés
async function listAuthorizedEmails() {
  console.log('\n🔍 Test 5: Liste des emails autorisés');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const data = await response.json();
    console.log('📋 Emails autorisés:', data);
    
    if (data.emails && data.emails.length > 0) {
      console.log('📧 Emails dans la liste:');
      data.emails.forEach(email => {
        console.log(`  - ${email.email} (${email.company || 'N/A'})`);
      });
    } else {
      console.log('📝 Aucun email autorisé');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🧪 Démarrage des tests de restriction d\'email...\n');
  
  await testAdminEmail();
  await testUnauthorizedEmail();
  await testDifferentDomain();
  await testRegistrationAttempt();
  await listAuthorizedEmails();
  
  console.log('\n🧪 Tests terminés !');
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.testAdminEmail = testAdminEmail;
  window.testUnauthorizedEmail = testUnauthorizedEmail;
  window.testDifferentDomain = testDifferentDomain;
  window.testRegistrationAttempt = testRegistrationAttempt;
  window.listAuthorizedEmails = listAuthorizedEmails;
  window.runAllTests = runAllTests;
  
  console.log('🧪 Tests disponibles :');
  console.log('  - runAllTests() : Exécuter tous les tests');
  console.log('  - testAdminEmail() : Tester l\'email admin');
  console.log('  - testUnauthorizedEmail() : Tester un email non autorisé');
  console.log('  - testDifferentDomain() : Tester un domaine différent');
  console.log('  - testRegistrationAttempt() : Simuler une inscription');
  console.log('  - listAuthorizedEmails() : Lister les emails autorisés');
} 