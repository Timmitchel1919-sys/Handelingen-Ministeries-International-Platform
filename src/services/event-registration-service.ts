import {
  doc, runTransaction, where, type QueryConstraint,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase';
import type { EventRegistration, ChurchEvent } from '@/types/event';
import { FirestoreRepository } from './firestore-repository';

const repo = new FirestoreRepository<Omit<EventRegistration, 'id'>>('eventRegistrations');

export const eventRegistrationService = {
  async getEventRegistrations(eventId: string, constraints: QueryConstraint[] = []) {
    return repo.list(
      [where('eventId', '==', eventId), ...constraints],
      100
    );
  },

  async updateRegistrationStatus(id: string, status: EventRegistration['status']) {
    return repo.update(id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Transactional registration that strictly checks:
   * 1. If the event allows registration
   * 2. If the capacity is reached
   * 3. If the user is already registered (no duplicates)
   */
  async registerMember(churchId: string, eventId: string, memberId: string) {
    const db = getFirebaseFirestore();
    if (!db) throw new Error('Firestore not initialized');

    return runTransaction(db, async (transaction) => {
      // 1. Get Event
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventSnap.data() as ChurchEvent;

      if (eventData.churchId !== churchId) {
        throw new Error('Unauthorized cross-church registration');
      }

      if (!eventData.registrationRequired) {
        throw new Error('Registration is not required for this event');
      }

      if (eventData.status === 'CANCELLED') {
        throw new Error('Event is cancelled');
      }

      // 2. Check Capacity
      if (
        eventData.capacity != null &&
        eventData.capacity > 0 &&
        eventData.registeredCount >= eventData.capacity
      ) {
        throw new Error('Event is at full capacity');
      }

      // 3. Check for Duplicates (Transactions don't support arbitrary queries easily, 
      // but we can query before the transaction, OR we can generate a deterministic ID)
      // Since EventRegistrations uses arbitrary IDs right now, generating a deterministic ID
      // is the best way to prevent duplicates in a transaction without a query lock.
      const deterministicRegId = `${eventId}_${memberId}`;
      const regRef = doc(db, 'eventRegistrations', deterministicRegId);
      const regSnap = await transaction.get(regRef);

      if (regSnap.exists()) {
        throw new Error('You are already registered for this event');
      }

      // 4. Perform Writes
      const now = new Date().toISOString();

      transaction.set(regRef, {
        eventId,
        churchId,
        memberId,
        status: 'REGISTERED',
        registeredAt: now,
        updatedAt: now,
      });

      transaction.update(eventRef, {
        registeredCount: (eventData.registeredCount || 0) + 1,
        updatedAt: now,
      });

      return { id: deterministicRegId };
    });
  },

  /**
   * Cancel registration and decrement count.
   */
  async cancelRegistration(churchId: string, eventId: string, memberId: string) {
    const db = getFirebaseFirestore();
    if (!db) throw new Error('Firestore not initialized');

    return runTransaction(db, async (transaction) => {
      const deterministicRegId = `${eventId}_${memberId}`;
      const regRef = doc(db, 'eventRegistrations', deterministicRegId);
      const regSnap = await transaction.get(regRef);

      if (!regSnap.exists()) {
        throw new Error('Registration not found');
      }

      const regData = regSnap.data() as EventRegistration;
      if (regData.churchId !== churchId) {
        throw new Error('Unauthorized cross-church cancellation');
      }

      if (regData.status === 'CANCELLED') {
        return; // Already cancelled
      }

      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await transaction.get(eventRef);

      transaction.update(regRef, {
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
      });

      if (eventSnap.exists()) {
        const eventData = eventSnap.data() as ChurchEvent;
        transaction.update(eventRef, {
          registeredCount: Math.max(0, (eventData.registeredCount || 1) - 1),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }
};
