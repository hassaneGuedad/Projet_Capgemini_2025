// Test rapide de la restriction d'email
// Copier ce code dans la console (F12)

console.log('🧪 Test rapide de la restriction d\'email...');

async function quickTest() {
  console.log('\n🔍 Test 1: Email non autorisé (test@unauthorized.com)');
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@unauthorized.com' })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (!data.isAuthorized) {
      console.log('✅ CORRECT: Email non autorisé');
    } else {
      console.log('❌ PROBLÈME: Email autorisé alors qu\'il ne devrait pas l\'être');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.log('\n🔍 Test 2: Email admin (scapworkspace@gmail.com)');
  
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'scapworkspace@gmail.com' })
    });
    
    const data = await response.json();
    console.log('📋 Réponse:', data);
    
    if (data.isAuthorized) {
      console.log('✅ CORRECT: Admin autorisé');
    } else {
      console.log('❌ PROBLÈME: Admin non autorisé');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.log('\n🔍 Test 3: Liste des emails autorisés');
  
  try {
    const response = await fetch('/api/admin/authorized-emails', {
      headers: { 'x-user-email': 'scapworkspace@gmail.com' }
    });
    
    const data = await response.json();
    console.log('📋 Nombre d\'emails autorisés:', data.emails?.length || 0);
    
    if (data.emails && data.emails.length > 0) {
      console.log('📧 Emails autorisés:');
      data.emails.forEach(email => {
        console.log(`  - ${email.email} (${email.company || 'N/A'})`);
      });
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le test
quickTest(); 