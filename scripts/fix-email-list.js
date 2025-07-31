// Script pour corriger la liste des emails autorisés
// À exécuter dans la console (F12)

console.log('🔧 Correction de la liste des emails autorisés...');

// Fonction pour supprimer un email autorisé
async function removeAuthorizedEmail(emailToRemove) {
  console.log(`🗑️ Suppression de: ${emailToRemove}`);
  
  try {
    // D'abord, récupérer la liste pour trouver l'ID
    const listResponse = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const listData = await listResponse.json();
    
    if (listData.emails) {
      const emailToDelete = listData.emails.find(email => email.email === emailToRemove);
      
      if (emailToDelete) {
        const deleteResponse = await fetch(`/api/admin/authorized-emails/${emailToDelete.id}`, {
          method: 'DELETE',
          headers: { 'x-user-email': 'scapworkspace@gmail.com' }
        });
        
        if (deleteResponse.ok) {
          console.log(`✅ ${emailToRemove} supprimé`);
        } else {
          console.log(`❌ Erreur lors de la suppression de ${emailToRemove}`);
        }
      } else {
        console.log(`⚠️ ${emailToRemove} non trouvé dans la liste`);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${emailToRemove}:`, error);
  }
}

// Fonction pour ajouter un email autorisé
async function addAuthorizedEmail(email, company, role) {
  console.log(`➕ Ajout de: ${email}`);
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-email': 'scapworkspace@gmail.com'
      },
      body: JSON.stringify({
        email: email,
        company: company,
        role: role
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${email} ajouté`);
    } else {
      console.log(`❌ Erreur lors de l'ajout de ${email}:`, data.error);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${email}:`, error);
  }
}

// Fonction pour corriger la liste complète
async function fixEmailList() {
  console.log('🔧 Début de la correction de la liste...\n');
  
  // Étape 1: Supprimer les emails incorrects
  console.log('1️⃣ Suppression des emails incorrects...');
  await removeAuthorizedEmail('hassaneemsi@gmail.com'); // Email incorrect
  await removeAuthorizedEmail('hassanguedad@capgemini.com'); // À vérifier
  
  // Étape 2: Ajouter les emails corrects
  console.log('\n2️⃣ Ajout des emails corrects...');
  await addAuthorizedEmail('hassaneemsi1@gmail.com', 'Capgemini', 'Stagiaire'); // Email correct
  await addAuthorizedEmail('hassan15guedad@gmail.com', 'Capgemini', 'Chef Projet'); // Déjà présent mais on s'assure
  await addAuthorizedEmail('scapworkspace@gmail.com', 'Capgemini', 'Administrateur Principal'); // Admin
  
  // Étape 3: Vérifier la liste finale
  console.log('\n3️⃣ Vérification de la liste finale...');
  await checkFinalList();
}

// Fonction pour vérifier la liste finale
async function checkFinalList() {
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const data = await response.json();
    console.log('📋 Liste finale des emails autorisés:');
    
    if (data.emails && data.emails.length > 0) {
      data.emails.forEach(email => {
        console.log(`  - ${email.email} (${email.company || 'N/A'}) - ${email.role || 'N/A'}`);
      });
    } else {
      console.log('📝 Aucun email autorisé');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Fonction pour nettoyer complètement et recommencer
async function cleanAndRestart() {
  console.log('🧹 Nettoyage complet et redémarrage...\n');
  
  try {
    // Récupérer tous les emails
    const response = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const data = await response.json();
    
    if (data.emails && data.emails.length > 0) {
      console.log('🗑️ Suppression de tous les emails existants...');
      
      for (const email of data.emails) {
        await removeAuthorizedEmail(email.email);
      }
    }
    
    console.log('\n➕ Ajout des emails corrects...');
    await addAuthorizedEmail('scapworkspace@gmail.com', 'Capgemini', 'Administrateur Principal');
    await addAuthorizedEmail('hassan15guedad@gmail.com', 'Capgemini', 'Chef Projet');
    await addAuthorizedEmail('hassaneemsi1@gmail.com', 'Capgemini', 'Stagiaire');
    
    console.log('\n✅ Nettoyage terminé !');
    await checkFinalList();
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.fixEmailList = fixEmailList;
  window.cleanAndRestart = cleanAndRestart;
  window.removeAuthorizedEmail = removeAuthorizedEmail;
  window.addAuthorizedEmail = addAuthorizedEmail;
  window.checkFinalList = checkFinalList;
  
  console.log('🔧 Fonctions disponibles :');
  console.log('  - cleanAndRestart() : Nettoyer et recommencer (RECOMMANDÉ)');
  console.log('  - fixEmailList() : Corriger la liste existante');
  console.log('  - checkFinalList() : Vérifier la liste actuelle');
  console.log('  - removeAuthorizedEmail(email) : Supprimer un email');
  console.log('  - addAuthorizedEmail(email, company, role) : Ajouter un email');
} 