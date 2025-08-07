import { db } from '../lib/firebase-admin';
import {
  Firestore,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase-admin/firestore';

export interface AuthorizedEmail {
  id?: string;
  email: string;
  company?: string;
  role?: string;
  addedAt: Date;
  addedBy?: string;
  isActive: boolean;
}

export class AuthorizedEmailService {
  private collectionName = 'authorizedEmails';

  private getDb(): Firestore {
    console.log('🔍 Service - Vérification Firebase DB:', !!db);
    if (!db) {
      console.error('❌ Firebase DB non initialisé');
      throw new Error('Firebase n\'est pas initialisé');
    }
    return db;
  }

  // Ajouter un email autorisé
  async addAuthorizedEmail(emailData: Omit<AuthorizedEmail, 'addedAt' | 'isActive'>): Promise<string> {
    console.log('🔍 Service - Ajout email autorisé:', emailData);

    try {
      const emailToAdd = {
        ...emailData,
        email: emailData.email.toLowerCase().trim(),
        addedAt: Timestamp.now(),
        isActive: true
      };

      console.log('🔍 Service - Email à ajouter:', emailToAdd);
      console.log('🔍 Service - Collection:', this.collectionName);

      const db = this.getDb();
      console.log('🔍 Service - DB initialisée:', !!db);

      const docRef = await db.collection(this.collectionName).add(emailToAdd);
      console.log('✅ Email autorisé ajouté:', emailData.email, 'ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout de l\'email autorisé:', error);
      console.error('❌ Stack trace:', error.stack);
      throw new Error(`Impossible d'ajouter l'email autorisé: ${error.message}`);
    }
  }

  // Supprimer un email autorisé
  async removeAuthorizedEmail(emailId: string): Promise<void> {
    try {
      await this.getDb().collection(this.collectionName).doc(emailId).delete();
      console.log('✅ Email autorisé supprimé:', emailId);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw new Error('Impossible de supprimer l\'email autorisé');
    }
  }

  // Vérifier si un email est autorisé
  async isEmailAuthorized(email: string): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const qSnap = await this.getDb()
        .collection(this.collectionName)
        .where('email', '==', normalizedEmail)
        .where('isActive', '==', true)
        .get();
      // Ajout de logs détaillés pour le debug
      console.log('DEBUG: Nombre de documents trouvés:', qSnap.size);
      qSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        console.log('DEBUG DOC:', doc.data());
      });
      const isAuthorized = !qSnap.empty;
      console.log(`🔍 Vérification email ${normalizedEmail}: ${isAuthorized ? 'AUTORISÉ' : 'NON AUTORISÉ'}`);
      return isAuthorized;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'email:', error);
      return false; // En cas d'erreur, on refuse l'accès par sécurité
    }
  }

  // Lister tous les emails autorisés
  async getAllAuthorizedEmails(): Promise<AuthorizedEmail[]> {
    try {
      const qSnap = await this.getDb()
        .collection(this.collectionName)
        .where('isActive', '==', true)
        .get();
      const emails: AuthorizedEmail[] = [];
      qSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        console.log('🔍 Service - Données Firestore:', data);
        // Conversion sécurisée de la date
        let addedAt: Date;
        if (data.addedAt && typeof data.addedAt.toDate === 'function') {
          addedAt = data.addedAt.toDate();
        } else if (data.addedAt) {
          addedAt = new Date(data.addedAt);
        } else {
          addedAt = new Date();
        }
        emails.push({
          id: doc.id,
          email: data.email,
          company: data.company || '',
          role: data.role || '',
          addedAt: addedAt,
          addedBy: data.addedBy || '',
          isActive: data.isActive
        });
      });
      return emails.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des emails autorisés:', error);
      throw new Error('Impossible de récupérer la liste des emails autorisés');
    }
  }

  // Rechercher des emails par domaine
  async getEmailsByDomain(domain: string): Promise<AuthorizedEmail[]> {
    try {
      const emails = await this.getAllAuthorizedEmails();
      return emails.filter(email => email.email.includes(`@${domain}`));
    } catch (error) {
      console.error('❌ Erreur lors de la recherche par domaine:', error);
      return [];
    }
  }

  // Statistiques
  async getStats(): Promise<{ total: number; domains: Record<string, number> }> {
    try {
      const emails = await this.getAllAuthorizedEmails();
      const domains: Record<string, number> = {};

      emails.forEach(email => {
        const domain = email.email.split('@')[1];
        domains[domain] = (domains[domain] || 0) + 1;
      });

      return {
        total: emails.length,
        domains
      };
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return { total: 0, domains: {} };
    }
  }

  // Ajouter plusieurs emails en lot
  async addBulkEmails(emails: Omit<AuthorizedEmail, 'addedAt' | 'isActive'>[]): Promise<string[]> {
    try {
      const promises = emails.map(emailData => this.addAuthorizedEmail(emailData));
      const results = await Promise.all(promises);
      console.log(`✅ ${results.length} emails ajoutés en lot`);
      return results;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout en lot:', error);
      throw new Error('Impossible d\'ajouter les emails en lot');
    }
  }
}

// Instance singleton
export const authorizedEmailService = new AuthorizedEmailService(); 