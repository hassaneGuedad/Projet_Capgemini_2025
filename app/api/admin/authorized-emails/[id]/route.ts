import { NextRequest, NextResponse } from 'next/server';
import { authorizedEmailService } from '../../../../../services/authorized-emails';

// Fonction pour vérifier l'accès administrateur
function checkAdminAccess(request: NextRequest): boolean {
  // Vérifier l'email de l'utilisateur connecté via les headers
  const userEmail = request.headers.get('x-user-email');
  console.log('🔍 Vérification admin - Email reçu:', userEmail);
  const isAdmin = userEmail === 'scapworkspace@gmail.com';
  console.log('🔍 Vérification admin - Résultat:', isAdmin);
  return isAdmin;
}

// DELETE - Supprimer un email autorisé
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Vérifier l'accès administrateur
  if (!checkAdminAccess(request)) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Seul l\'administrateur peut accéder à cette fonctionnalité.' },
      { status: 403 }
    );
  }
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'email requis' },
        { status: 400 }
      );
    }

    await authorizedEmailService.removeAuthorizedEmail(id);

    return NextResponse.json({
      success: true,
      message: 'Email autorisé supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'email autorisé:', error);
    return NextResponse.json(
      { error: 'Impossible de supprimer l\'email autorisé' },
      { status: 500 }
    );
  }
} 