import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { EventRegistration } from '@/types/event';

const repo = new FirestoreRepository<Omit<EventRegistration, 'id'>>('eventRegistrations');

export const eventRegistrationService = {
  async getEventRegistrations(eventId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('eventId', '==', eventId),
      ...constraints
    ], 100);
  },

  async createRegistration(data: Omit<EventRegistration, 'id' | 'registeredAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return repo.create({
      ...data,
      registeredAt: now,
      updatedAt: now,
    });
  },

  async updateRegistrationStatus(id: string, status: EventRegistration['status']) {
    return repo.update(id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  },
};
