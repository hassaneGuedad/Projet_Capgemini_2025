// Script pour ajouter l'email admin
// À exécuter dans la console du navigateur

async function addAdminEmail() {
  console.log('🔧 Ajout de l\'email admin...');
  
  const adminEmail = 'scapworkspace@gmail.com';
  
  try {
    // D'abord, vérifier si l'admin est déjà autorisé
    console.log('🔍 Vérification si l\'admin est déjà autorisé...');
    const checkResponse = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail })
    });
    
    const checkData = await checkResponse.json();
    
    if (checkResponse.ok && checkData.isAuthorized) {
      console.log('✅ L\'admin est déjà autorisé !');
      return;
    }
    
    // Si l'admin n'est pas autorisé, l'ajouter
    console.log('➕ Ajout de l\'admin dans la liste des emails autorisés...');
    
    const response = await fetch('/api/admin/authorized-emails', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': adminEmail // On utilise l'email admin lui-même
      },
      body: JSON.stringify({
        email: adminEmail,
        company: 'Capgemini',
        role: 'Administrateur Principal'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin ajouté avec succès !');
      console.log('📧 Email:', adminEmail);
      console.log('🏢 Entreprise: Capgemini');
      console.log('👤 Rôle: Administrateur Principal');
    } else {
      console.error('❌ Erreur lors de l\'ajout:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Vérifier le statut de l'admin
async function checkAdminStatus() {
  console.log('🔍 Vérification du statut admin...');
  
  const adminEmail = 'scapworkspace@gmail.com';
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      if (data.isAuthorized) {
        console.log('✅ Admin autorisé - Peut se connecter');
      } else {
        console.log('❌ Admin non autorisé - Doit être ajouté');
      }
    } else {
      console.log('❌ Erreur lors de la vérification:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Solution temporaire : Ajouter l'admin directement via Firebase
async function addAdminDirectly() {
  console.log('🔧 Ajout direct de l\'admin...');
  
  const adminEmail = 'scapworkspace@gmail.com';
  
  try {
    // Utiliser la route spéciale d'initialisation
    const response = await fetch('/api/admin/init-admin', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        company: 'Capgemini',
        role: 'Administrateur Principal'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin ajouté directement !');
      console.log('📧 Email:', adminEmail);
      console.log('📋 Message:', data.message);
    } else {
      console.error('❌ Erreur:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.addAdminEmail = addAdminEmail;
  window.checkAdminStatus = checkAdminStatus;
  window.addAdminDirectly = addAdminDirectly;
  
  console.log('🔧 Scripts d\'ajout admin disponibles :');
  console.log('  - checkAdminStatus() : Vérifier le statut admin');
  console.log('  - addAdminEmail() : Ajouter l\'admin normalement');
  console.log('  - addAdminDirectly() : Ajouter l\'admin directement');
} 