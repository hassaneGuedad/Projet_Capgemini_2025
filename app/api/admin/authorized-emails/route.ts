import { NextRequest, NextResponse } from 'next/server';
import { authorizedEmailService } from '../../../../services/authorized-emails';

// Fonction pour vérifier l'accès administrateur
function checkAdminAccess(request: NextRequest): boolean {
  // Vérifier l'email de l'utilisateur connecté via les headers
  const userEmail = request.headers.get('x-user-email');
  console.log('🔍 Vérification admin - Email reçu:', userEmail);
  const isAdmin = userEmail === 'scapworkspace@gmail.com';
  console.log('🔍 Vérification admin - Résultat:', isAdmin);
  return isAdmin;
}

// GET - Lister tous les emails autorisés
export async function GET(request: NextRequest) {
  // Vérifier l'accès administrateur
  if (!checkAdminAccess(request)) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Seul l\'administrateur peut accéder à cette fonctionnalité.' },
      { status: 403 }
    );
  }
  try {
    const emails = await authorizedEmailService.getAllAuthorizedEmails();
    const stats = await authorizedEmailService.getStats();

    return NextResponse.json({
      success: true,
      emails,
      stats
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des emails autorisés:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer la liste des emails autorisés' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un email autorisé ou plusieurs en lot
export async function POST(request: NextRequest) {
  console.log('🔍 POST /api/admin/authorized-emails - Début de la requête');
  
  // Vérifier l'accès administrateur
  if (!checkAdminAccess(request)) {
    console.log('❌ Accès refusé - Utilisateur non admin');
    return NextResponse.json(
      { error: 'Accès non autorisé. Seul l\'administrateur peut accéder à cette fonctionnalité.' },
      { status: 403 }
    );
  }
  
  console.log('✅ Accès autorisé - Utilisateur admin');
  
  try {
    const body = await request.json();
    console.log('🔍 Body reçu:', body);
    const { email, company, role, addedBy, bulkEmails } = body;

    // Si bulkEmails est fourni, ajouter plusieurs emails
    if (bulkEmails && Array.isArray(bulkEmails)) {
      console.log('🔍 Ajout en lot - Nombre d\'emails:', bulkEmails.length);
      const emailIds = await authorizedEmailService.addBulkEmails(bulkEmails);
      
      return NextResponse.json({
        success: true,
        message: `${emailIds.length} emails autorisés ajoutés avec succès`,
        emailIds
      });
    }

    // Sinon, ajouter un seul email
    console.log('🔍 Ajout d\'un seul email:', { email, company, role });
    
    if (!email) {
      console.log('❌ Email manquant');
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Format d\'email invalide:', email);
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('✅ Email valide, ajout en cours...');
    const emailId = await authorizedEmailService.addAuthorizedEmail({
      email,
      company: company || '',
      role: role || '',
      addedBy: addedBy || 'admin'
    });

    console.log('✅ Email ajouté avec succès, ID:', emailId);
    return NextResponse.json({
      success: true,
      message: 'Email autorisé ajouté avec succès',
      emailId
    });

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'ajout de l\'email autorisé:', error);
    console.error('❌ Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Impossible d\'ajouter l\'email autorisé', details: error.message },
      { status: 500 }
    );
  }
} 