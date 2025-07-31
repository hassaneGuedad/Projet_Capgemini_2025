// Script de debug pour identifier le problème de restriction d'email
// À exécuter dans la console (F12)

console.log('🔍 Debug de la restriction d\'email...');

// Test complet du flux d'inscription
async function debugRegistrationFlow() {
  console.log('\n🔍 Test du flux d\'inscription complet...');
  
  const testEmail = 'test@unauthorized.com';
  console.log(`📧 Email de test: ${testEmail}`);
  
  try {
    // Étape 1: Vérifier si l'email est autorisé
    console.log('\n1️⃣ Vérification de l\'autorisation...');
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const checkData = await checkResponse.json();
    console.log('📋 Réponse de vérification:', checkData);
    
    if (checkData.isAuthorized) {
      console.log('❌ PROBLÈME: Email autorisé alors qu\'il ne devrait pas l\'être');
    } else {
      console.log('✅ Email correctement non autorisé');
    }
    
    // Étape 2: Simuler la tentative d'inscription
    console.log('\n2️⃣ Simulation de l\'inscription...');
    
    // Simuler le comportement du composant AuthDialog
    if (!checkData.isAuthorized) {
      console.log('✅ Inscription bloquée (comportement attendu)');
      console.log('💡 Message d\'erreur attendu: "Cet email n\'est pas autorisé à accéder à la plateforme..."');
    } else {
      console.log('❌ PROBLÈME: Inscription autorisée (comportement inattendu)');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Test de la liste des emails autorisés
async function debugAuthorizedList() {
  console.log('\n🔍 Vérification de la liste des emails autorisés...');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const data = await response.json();
    console.log('📋 Liste complète:', data);
    
    if (data.emails && data.emails.length > 0) {
      console.log('📧 Emails actuellement autorisés:');
      data.emails.forEach((email, index) => {
        console.log(`  ${index + 1}. ${email.email} (${email.company || 'N/A'}) - Actif: ${email.isActive}`);
      });
    } else {
      console.log('📝 Aucun email autorisé dans la liste');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la liste:', error);
  }
}

// Test de différents emails
async function testMultipleEmails() {
  console.log('\n🔍 Test de plusieurs emails...');
  
  const testEmails = [
    'scapworkspace@gmail.com',    // Admin - devrait être autorisé
    'test@capgemini.com',         // Email professionnel - pourrait être autorisé
    'random@example.com',         // Email aléatoire - devrait être refusé
    'hacker@gmail.com',           // Email suspect - devrait être refusé
    'test@unauthorized.com'       // Email de test - devrait être refusé
  ];
  
  for (const email of testEmails) {
    console.log(`\n📧 Test de: ${email}`);
    
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.isAuthorized) {
        console.log(`  ✅ AUTORISÉ`);
      } else {
        console.log(`  ❌ NON AUTORISÉ`);
      }
      
    } catch (error) {
      console.log(`  ❌ ERREUR: ${error.message}`);
    }
  }
}

// Test de simulation d'inscription réelle
async function simulateRealRegistration() {
  console.log('\n🔍 Simulation d\'inscription réelle...');
  
  const testEmail = 'test@unauthorized.com';
  const testPassword = 'testpassword123';
  
  console.log(`📧 Tentative d'inscription avec: ${testEmail}`);
  
  try {
    // Simuler exactement ce que fait AuthDialog
    console.log('1️⃣ Vérification de l\'email...');
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const checkData = await checkResponse.json();
    console.log('📋 Résultat de la vérification:', checkData);
    
    if (!checkData.isAuthorized) {
      console.log('✅ Inscription bloquée par la vérification');
      console.log('💡 L\'utilisateur devrait voir le message d\'erreur');
      return;
    }
    
    console.log('❌ PROBLÈME: Email autorisé, inscription possible');
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
  }
}

// Exécuter tous les tests de debug
async function runDebugTests() {
  console.log('🔍 Démarrage des tests de debug...\n');
  
  await debugAuthorizedList();
  await testMultipleEmails();
  await debugRegistrationFlow();
  await simulateRealRegistration();
  
  console.log('\n🔍 Tests de debug terminés !');
  console.log('\n💡 Si tu vois des "PROBLÈME", il y a un bug dans la logique.');
  console.log('💡 Si tout est "✅", le système fonctionne correctement.');
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.debugRegistrationFlow = debugRegistrationFlow;
  window.debugAuthorizedList = debugAuthorizedList;
  window.testMultipleEmails = testMultipleEmails;
  window.simulateRealRegistration = simulateRealRegistration;
  window.runDebugTests = runDebugTests;
  
  console.log('🔍 Tests de debug disponibles :');
  console.log('  - runDebugTests() : Exécuter tous les tests de debug');
  console.log('  - debugRegistrationFlow() : Tester le flux d\'inscription');
  console.log('  - debugAuthorizedList() : Vérifier la liste des emails');
  console.log('  - testMultipleEmails() : Tester plusieurs emails');
  console.log('  - simulateRealRegistration() : Simuler une inscription réelle');
} 