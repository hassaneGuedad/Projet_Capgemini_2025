// Script de test pour la restriction Google
// À exécuter dans la console du navigateur

async function testGoogleRestriction() {
  console.log('🧪 Test de la restriction Google...');
  
  // Simuler la vérification d'un email Google
  const testEmails = [
    'scapworkspace@gmail.com', // Admin - devrait être autorisé
    'test@capgemini.com',      // Email ajouté par admin - devrait être autorisé
    'random@gmail.com',        // Email Google non autorisé - devrait être refusé
    'test@unauthorized.com'    // Email non autorisé - devrait être refusé
  ];
  
  for (const email of testEmails) {
    console.log(`\n📧 Test de l'email Google: ${email}`);
    
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.isAuthorized) {
          console.log(`✅ ${email} - AUTORISÉ (connexion Google possible)`);
        } else {
          console.log(`❌ ${email} - NON AUTORISÉ (connexion Google refusée)`);
          console.log('💡 Message d\'erreur: Cet email Google n\'est pas autorisé à accéder à la plateforme.');
        }
      } else {
        console.log(`❌ Erreur pour ${email}:`, data.error);
      }
      
    } catch (error) {
      console.error(`❌ Erreur pour ${email}:`, error);
    }
  }
}

// Simulation du processus de connexion Google
async function simulateGoogleSignIn(email) {
  console.log(`\n🧪 Simulation connexion Google avec: ${email}`);
  
  try {
    // Étape 1: Connexion Google (simulée)
    console.log('1️⃣ Connexion Google réussie');
    
    // Étape 2: Vérification de l'email
    console.log('2️⃣ Vérification de l\'email autorisé...');
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok && data.isAuthorized) {
      console.log('✅ Accès autorisé - Utilisateur connecté');
      return true;
    } else {
      console.log('❌ Accès refusé - Utilisateur déconnecté');
      console.log('💡 Raison: Email non autorisé');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
    return false;
  }
}

// Test de différents scénarios
async function testGoogleScenarios() {
  console.log('🧪 Test des scénarios Google...');
  
  // Scénario 1: Email autorisé
  console.log('\n📋 Scénario 1: Email autorisé');
  await simulateGoogleSignIn('scapworkspace@gmail.com');
  
  // Scénario 2: Email non autorisé
  console.log('\n📋 Scénario 2: Email non autorisé');
  await simulateGoogleSignIn('random@gmail.com');
  
  // Scénario 3: Email ajouté par admin
  console.log('\n📋 Scénario 3: Email ajouté par admin');
  await simulateGoogleSignIn('test@capgemini.com');
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.testGoogleRestriction = testGoogleRestriction;
  window.simulateGoogleSignIn = simulateGoogleSignIn;
  window.testGoogleScenarios = testGoogleScenarios;
  
  console.log('🧪 Scripts de test Google disponibles :');
  console.log('  - testGoogleRestriction() : Test de plusieurs emails Google');
  console.log('  - simulateGoogleSignIn(email) : Simulation connexion Google');
  console.log('  - testGoogleScenarios() : Test des différents scénarios');
} 