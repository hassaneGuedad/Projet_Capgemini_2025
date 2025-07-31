import { NextRequest, NextResponse } from 'next/server';
import { authorizedEmailService } from '../../../../services/authorized-emails';

// Route spéciale pour initialiser l'admin
export async function POST(request: NextRequest) {
  console.log('🔧 POST /api/admin/init-admin - Initialisation de l\'admin');
  
  try {
    const { email, company, role } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si c'est bien l'email admin
    if (email !== 'scapworkspace@gmail.com') {
      return NextResponse.json(
        { error: 'Seul l\'email admin peut être initialisé via cette route' },
        { status: 403 }
      );
    }
    
    // Vérifier si l'admin existe déjà
    const isAlreadyAuthorized = await authorizedEmailService.isEmailAuthorized(email);
    
    if (isAlreadyAuthorized) {
      console.log('✅ Admin déjà autorisé');
      return NextResponse.json({
        success: true,
        message: 'Admin déjà autorisé',
        email: email
      });
    }
    
    // Ajouter l'admin
    console.log('➕ Ajout de l\'admin...');
    const emailId = await authorizedEmailService.addAuthorizedEmail({
      email: email,
      company: company || 'Capgemini',
      role: role || 'Administrateur Principal',
      addedBy: 'system-init'
    });
    
    console.log('✅ Admin initialisé avec succès, ID:', emailId);
    
    return NextResponse.json({
      success: true,
      message: 'Admin initialisé avec succès',
      emailId: emailId,
      email: email
    });
    
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation de l\'admin', details: error.message },
      { status: 500 }
    );
  }
} 