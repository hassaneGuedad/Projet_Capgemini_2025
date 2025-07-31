// Script de test pour email Google non autorisé
// À exécuter dans la console du navigateur

async function testUnauthorizedGoogle() {
  console.log('🧪 Test avec email Google non autorisé...');
  
  const unauthorizedEmails = [
    'random@gmail.com',
    'test@unauthorized.com',
    'user@example.com',
    'demo@gmail.com'
  ];
  
  for (const email of unauthorizedEmails) {
    console.log(`\n📧 Test de l'email non autorisé: ${email}`);
    
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.isAuthorized) {
          console.log(`⚠️  ${email} - AUTORISÉ (inattendu)`);
        } else {
          console.log(`✅ ${email} - NON AUTORISÉ (comportement attendu)`);
          console.log('💡 Ce email serait refusé lors de la connexion Google');
        }
      } else {
        console.log(`❌ Erreur pour ${email}:`, data.error);
      }
      
    } catch (error) {
      console.error(`❌ Erreur pour ${email}:`, error);
    }
  }
}

// Simulation du processus complet
async function simulateUnauthorizedGoogleSignIn() {
  console.log('\n🧪 Simulation connexion Google non autorisée...');
  
  const testEmail = 'random@gmail.com';
  console.log(`📧 Email de test: ${testEmail}`);
  
  try {
    // Étape 1: Connexion Google (simulée)
    console.log('1️⃣ Connexion Google réussie (simulation)');
    
    // Étape 2: Vérification de l'email
    console.log('2️⃣ Vérification de l\'email autorisé...');
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const data = await response.json();
    
    if (response.ok && data.isAuthorized) {
      console.log('✅ Accès autorisé - Utilisateur connecté');
      return true;
    } else {
      console.log('❌ Accès refusé - Utilisateur déconnecté');
      console.log('💡 Message d\'erreur: Cet email Google n\'est pas autorisé à accéder à la plateforme.');
      console.log('💡 Action: L\'utilisateur est automatiquement déconnecté');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
    return false;
  }
}

// Instructions pour tester manuellement
function showManualTestInstructions() {
  console.log('\n📋 Instructions pour test manuel :');
  console.log('1. Se déconnecter si connecté');
  console.log('2. Cliquer "Se connecter avec Google"');
  console.log('3. Se connecter avec un compte Google différent');
  console.log('4. Vérifier que l\'accès est refusé si l\'email n\'est pas autorisé');
  console.log('5. Vérifier le message d\'erreur approprié');
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.testUnauthorizedGoogle = testUnauthorizedGoogle;
  window.simulateUnauthorizedGoogleSignIn = simulateUnauthorizedGoogleSignIn;
  window.showManualTestInstructions = showManualTestInstructions;
  
  console.log('🧪 Scripts de test email non autorisé disponibles :');
  console.log('  - testUnauthorizedGoogle() : Test de plusieurs emails non autorisés');
  console.log('  - simulateUnauthorizedGoogleSignIn() : Simulation complète');
  console.log('  - showManualTestInstructions() : Instructions pour test manuel');
} 