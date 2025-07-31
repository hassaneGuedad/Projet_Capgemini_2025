// Script pour vérifier les emails actuellement autorisés
// À exécuter dans la console du navigateur

async function checkCurrentAuthorizedEmails() {
  console.log('🔍 Vérification des emails actuellement autorisés...');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Liste des emails autorisés:');
      
      if (data.emails && data.emails.length > 0) {
        data.emails.forEach((email, index) => {
          console.log(`${index + 1}. ${email.email} (${email.company || 'N/A'}) - ${email.role || 'N/A'}`);
        });
      } else {
        console.log('📝 Aucun email autorisé trouvé');
      }
      
      console.log(`\n📊 Statistiques:`);
      console.log(`- Total: ${data.stats.total} emails`);
      console.log(`- Domaines:`, data.stats.domains);
      
    } else {
      const error = await response.json();
      console.error('❌ Erreur:', error);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Vérifier si un email spécifique est autorisé
async function checkSpecificEmail(emailToCheck) {
  console.log(`🔍 Vérification de l'email: ${emailToCheck}`);
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToCheck })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      if (data.isAuthorized) {
        console.log(`❌ ${emailToCheck} - AUTORISÉ (doit être supprimé)`);
        return true;
      } else {
        console.log(`✅ ${emailToCheck} - NON AUTORISÉ (correct)`);
        return false;
      }
    } else {
      console.log(`❌ Erreur pour ${emailToCheck}:`, data.error);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Erreur pour ${emailToCheck}:`, error);
    return false;
  }
}

// Nettoyer tous les emails sauf l'admin
async function cleanAuthorizedEmails() {
  console.log('🧹 Nettoyage des emails autorisés...');
  console.log('⚠️  ATTENTION: Cette action va supprimer tous les emails sauf scapworkspace@gmail.com');
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer tous les emails autorisés sauf l\'admin ?')) {
    console.log('❌ Opération annulée');
    return;
  }
  
  try {
    // Récupérer la liste actuelle
    const response = await fetch('/api/admin/authorized-emails', {
      headers: {
        'x-user-email': 'scapworkspace@gmail.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.emails && data.emails.length > 0) {
        console.log(`🗑️  Suppression de ${data.emails.length} emails...`);
        
        for (const email of data.emails) {
          if (email.email !== 'scapworkspace@gmail.com') {
            console.log(`🗑️  Suppression de: ${email.email}`);
            
            const deleteResponse = await fetch(`/api/admin/authorized-emails/${email.id}`, {
              method: 'DELETE',
              headers: {
                'x-user-email': 'scapworkspace@gmail.com'
              }
            });
            
            if (deleteResponse.ok) {
              console.log(`✅ ${email.email} supprimé`);
            } else {
              console.log(`❌ Erreur lors de la suppression de ${email.email}`);
            }
          } else {
            console.log(`✅ ${email.email} conservé (admin)`);
          }
        }
        
        console.log('🎉 Nettoyage terminé !');
        
      } else {
        console.log('📝 Aucun email à supprimer');
      }
      
    } else {
      const error = await response.json();
      console.error('❌ Erreur:', error);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Fonctions disponibles dans la console
if (typeof window !== 'undefined') {
  window.checkCurrentAuthorizedEmails = checkCurrentAuthorizedEmails;
  window.checkSpecificEmail = checkSpecificEmail;
  window.cleanAuthorizedEmails = cleanAuthorizedEmails;
  
  console.log('🔍 Scripts de vérification disponibles :');
  console.log('  - checkCurrentAuthorizedEmails() : Voir tous les emails autorisés');
  console.log('  - checkSpecificEmail(email) : Vérifier un email spécifique');
  console.log('  - cleanAuthorizedEmails() : Nettoyer tous les emails sauf l\'admin');
} 