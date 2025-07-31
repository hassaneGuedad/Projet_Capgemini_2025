// Script alternatif - Ajout direct via Firebase
// À utiliser si la route API ne fonctionne pas

console.log('🔧 Ajout direct via Firebase...');

// Vérifier si Firebase est disponible
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase disponible');
  
  // Ajouter l'admin directement
  const adminData = {
    email: 'scapworkspace@gmail.com',
    company: 'Capgemini',
    role: 'Administrateur Principal',
    addedAt: new Date(),
    addedBy: 'direct-firebase',
    isActive: true
  };
  
  // Utiliser la collection Firestore
  const db = window.firebase.firestore();
  db.collection('authorizedEmails').add(adminData)
    .then((docRef) => {
      console.log('✅ Admin ajouté directement, ID:', docRef.id);
      console.log('🔄 Maintenant tu peux te reconnecter');
    })
    .catch((error) => {
      console.error('❌ Erreur Firebase:', error);
    });
} else {
  console.log('❌ Firebase non disponible');
  console.log('💡 Utilise le script quick-admin-fix.js à la place');
} 