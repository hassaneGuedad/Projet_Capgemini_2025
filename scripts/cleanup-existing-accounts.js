// Script pour nettoyer les comptes existants non autorisés
console.log('🧹 Nettoyage des comptes existants non autorisés...');

async function cleanupExistingAccounts() {
  try {
    console.log('\n🔍 === ÉTAPE 1: ANALYSE DE LA SITUATION ===');
    console.log('📋 Problème identifié:');
    console.log('- gcluxurycar@gmail.com est NON AUTORISÉ dans l\'API');
    console.log('- Mais le compte existe dans Firebase Auth');
    console.log('- Cela signifie qu\'il s\'est inscrit avant la vérification');
    
    console.log('\n🔍 === ÉTAPE 2: RECOMMANDATIONS ===');
    console.log('💡 Solutions possibles:');
    console.log('1. Supprimer manuellement le compte de Firebase Auth');
    console.log('2. Ajouter une vérification côté serveur pour les connexions existantes');
    console.log('3. Forcer la déconnexion des utilisateurs non autorisés');
    
    console.log('\n🔍 === ÉTAPE 3: TEST DE CONNEXION ===');
    console.log('📝 Pour confirmer le problème:');
    console.log('1. Essayez de vous connecter avec gcluxurycar@gmail.com');
    console.log('2. Vous devriez voir les logs de vérification dans la console');
    console.log('3. Le système devrait maintenant bloquer la connexion');
    
    console.log('\n🔍 === ÉTAPE 4: VÉRIFICATION API ===');
    
    // Test de l'API de vérification
    const testEmail = 'gcluxurycar@gmail.com';
    console.log(`🔍 Test de vérification pour: ${testEmail}`);
    
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    const data = await response.json();
    console.log(`📋 Résultat:`, data);
    
    if (!data.isAuthorized) {
      console.log('✅ CORRECT: L\'API bloque correctement gcluxurycar@gmail.com');
      console.log('💡 Le problème est que le compte existe déjà dans Firebase');
    } else {
      console.log('❌ PROBLÈME: L\'API autorise gcluxurycar@gmail.com');
    }
    
    console.log('\n🔍 === ÉTAPE 5: SOLUTION RECOMMANDÉE ===');
    console.log('📝 Actions à effectuer:');
    console.log('1. Aller dans Firebase Console > Authentication > Users');
    console.log('2. Chercher gcluxurycar@gmail.com');
    console.log('3. Supprimer ce compte utilisateur');
    console.log('4. Tester à nouveau l\'inscription/connexion');
    console.log('5. Vérifier que le système bloque maintenant correctement');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
cleanupExistingAccounts(); 