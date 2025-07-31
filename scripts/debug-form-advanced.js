// Script de débogage avancé pour le formulaire
console.log('🔍 Débogage avancé du formulaire d\'inscription...');

async function debugFormAdvanced() {
  try {
    console.log('\n🔍 === ÉTAPE 1: VÉRIFICATION DU COMPOSANT ===');
    console.log('📋 Vérification si le composant AuthDialog est bien chargé...');
    
    // Vérifier si le composant existe dans le DOM
    const authDialog = document.querySelector('[role="dialog"]');
    if (authDialog) {
      console.log('✅ Composant AuthDialog trouvé dans le DOM');
    } else {
      console.log('❌ Composant AuthDialog NON trouvé dans le DOM');
    }
    
    console.log('\n🔍 === ÉTAPE 2: VÉRIFICATION DES ÉVÉNEMENTS ===');
    console.log('📋 Test de simulation d\'événement de soumission...');
    
    // Simuler un événement de soumission
    const testEmail = 'gcluxurycar@gmail.com';
    const testPassword = 'testpassword123';
    
    console.log(`🔍 Simulation événement avec: ${testEmail}`);
    
    // Créer un événement de soumission simulé
    const mockEvent = {
      preventDefault: () => {
        console.log('🔍 preventDefault() appelé');
      }
    };
    
    console.log('\n🔍 === ÉTAPE 3: TEST DE L\'API DIRECT ===');
    
    // Test direct de l'API
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const data = await response.json();
    console.log(`📋 API Response:`, data);
    
    if (!data.isAuthorized) {
      console.log('✅ API fonctionne correctement - email non autorisé');
      
      console.log('\n🔍 === ÉTAPE 4: DIAGNOSTIC DU PROBLÈME ===');
      console.log('📋 Causes possibles du problème:');
      console.log('1. Le composant AuthDialog n\'est pas le bon composant utilisé');
      console.log('2. Il y a un autre composant d\'authentification qui est utilisé');
      console.log('3. Le formulaire utilise une logique différente');
      console.log('4. Il y a un problème de cache ou de rechargement');
      console.log('5. Le composant n\'a pas été mis à jour après les modifications');
      
      console.log('\n🔍 === ÉTAPE 5: VÉRIFICATIONS ===');
      console.log('📝 Vérifications à effectuer:');
      console.log('1. Avez-vous redémarré le serveur de développement ?');
      console.log('2. Avez-vous vidé le cache du navigateur ?');
      console.log('3. Utilisez-vous le bon bouton "Se connecter" ?');
      console.log('4. Y a-t-il plusieurs boutons de connexion sur la page ?');
      
      console.log('\n🔍 === ÉTAPE 6: SOLUTION TEMPORAIRE ===');
      console.log('📝 En attendant de résoudre le problème:');
      console.log('- Utilisez Google Sign-In qui fonctionne correctement');
      console.log('- Ou désactivez temporairement l\'inscription par formulaire');
      console.log('- Ou ajoutez temporairement gcluxurycar@gmail.com à la liste autorisée');
      
      console.log('\n🔍 === ÉTAPE 7: TEST ALTERNATIF ===');
      console.log('📝 Test alternatif:');
      console.log('1. Ouvrez une fenêtre de navigation privée');
      console.log('2. Allez sur votre site');
      console.log('3. Regardez s\'il y a plusieurs boutons "Se connecter"');
      console.log('4. Essayez de vous connecter avec Google Sign-In');
      console.log('5. Vérifiez que Google Sign-In fonctionne correctement');
      
    } else {
      console.log('❌ PROBLÈME: L\'API autorise un email non autorisé !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du débogage avancé:', error);
  }
}

// Exécuter le débogage avancé
debugFormAdvanced(); 