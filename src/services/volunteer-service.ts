import { doc, setDoc } from 'firebase/firestore';
import { where, type QueryConstraint } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';
import { FirestoreRepository } from './firestore-repository';
import type { VolunteerProfile } from '@/types/layer11';

// We use FirestoreRepository for reading and querying, but writing needs setDoc for custom ID
const volunteerRepo = new FirestoreRepository<VolunteerProfile>('volunteerProfiles');

export const volunteerService = {
  async getVolunteerProfile(churchId: string, memberId: string) {
    try {
      const profile = await volunteerRepo.getById(memberId);
      if (profile.churchId !== churchId) {
        throw { kind: 'not-found', message: 'Volunteer profile not found.' };
      }
      return profile;
    } catch (err: any) {
      if (err.kind === 'not-found') {
        return null;
      }
      throw err;
    }
  },

  async getVolunteersByChurch(churchId: string, constraints: QueryConstraint[] = []) {
    return volunteerRepo.list([
      where('churchId', '==', churchId),
      ...constraints
    ], 100);
  },

  async upsertVolunteerProfile(churchId: string, memberId: string, data: Partial<Omit<VolunteerProfile, 'memberId' | 'churchId' | 'createdAt' | 'updatedAt'>>) {
    const db = getFirebaseFirestore();
    if (!db) {
      throw { kind: 'network', message: 'Firebase is not configured.' };
    }

    const existingProfile = await this.getVolunteerProfile(churchId, memberId);

    const docRef = doc(db, 'volunteerProfiles', memberId);
    
    if (existingProfile) {
      await setDoc(docRef, {
        ...existingProfile,
        ...data,
        updatedAt: Date.now(),
      });
      return memberId;
    } else {
      const newProfile: VolunteerProfile = {
        memberId,
        churchId,
        status: data.status || 'INTERESTED',
        skills: data.skills || [],
        interests: data.interests || [],
        preferredRoles: data.preferredRoles || [],
        availability: data.availability || '',
        unavailableDates: data.unavailableDates || [],
        notes: data.notes || '',
        approvedBy: data.approvedBy || null,
        approvedAt: data.approvedAt || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...data,
      };
      await setDoc(docRef, newProfile);
      return memberId;
    }
  },

  async updateAvailability(churchId: string, memberId: string, availability: string, unavailableDates: string[]) {
    return this.upsertVolunteerProfile(churchId, memberId, { availability, unavailableDates });
  }
};
