import { NextRequest, NextResponse } from 'next/server';
import { authorizedEmailService } from '../../../../services/authorized-emails';

export async function POST(request: NextRequest) {
  console.log('🔍 POST /api/auth/check-email - Début de la vérification');
  
  try {
    const { email } = await request.json();
    console.log('🔍 Email à vérifier:', email);

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

    // Vérifier si l'email est autorisé
    console.log('🔍 Vérification de l\'autorisation...');
    const isAuthorized = await authorizedEmailService.isEmailAuthorized(email);
    console.log('🔍 Résultat de la vérification:', isAuthorized);

    return NextResponse.json({
      success: true,
      isAuthorized,
      email: email.toLowerCase().trim()
    });

  } catch (error: any) {
    console.error('❌ Erreur lors de la vérification de l\'email:', error);
    console.error('❌ Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de l\'email', details: error.message },
      { status: 500 }
    );
  }
} 