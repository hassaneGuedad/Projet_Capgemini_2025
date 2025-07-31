// Script rapide pour ajouter l'admin
// Copier tout ce code dans la console (F12)

console.log('🔧 Ajout rapide de l\'admin...');

async function quickAddAdmin() {
  try {
    const response = await fetch('/api/admin/init-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'scapworkspace@gmail.com',
        company: 'Capgemini',
        role: 'Administrateur Principal'
      })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (response.ok) {
      console.log('✅ Admin ajouté avec succès !');
      console.log('🔄 Maintenant tu peux te reconnecter avec Google');
    } else {
      console.error('❌ Erreur:', data.error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter immédiatement
quickAddAdmin(); 