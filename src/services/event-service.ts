import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { ChurchEvent } from '@/types/event';

const repo = new FirestoreRepository<Omit<ChurchEvent, 'id'>>('events');

export const eventService = {
  async getEventById(churchId: string, id: string) {
    const event = await repo.getById(id);
    if (event.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Event not found.' };
    }
    return event;
  },

  async queryEvents(churchId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('churchId', '==', churchId),
      ...constraints
    ], 100);
  },

  async createEvent(data: Omit<ChurchEvent, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy' | 'createdBy' | 'updatedBy'>, actorUid: string) {
    const now = new Date().toISOString();
    return repo.create({
      ...data,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUid,
      updatedBy: actorUid,
      deletedAt: null,
      deletedBy: null,
    });
  },

  async updateEvent(churchId: string, id: string, data: Partial<Omit<ChurchEvent, 'id' | 'createdAt' | 'createdBy' | 'churchId'>>, actorUid: string) {
    await this.getEventById(churchId, id);
    return repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: actorUid,
    });
  },

  async getDashboardUpcomingEvents(churchId: string, limitCount = 3) {
    const now = new Date().toISOString();
    return repo.list([
      where('churchId', '==', churchId),
      where('startAt', '>=', now)
    ], limitCount);
  },

  async getUpcomingPublicEvents(constraints: QueryConstraint[] = []) {
    const now = new Date().toISOString();
    return repo.list([
      where('visibility', '==', 'PUBLIC'),
      where('startAt', '>=', now),
      ...constraints
    ], 50);
  },

  async getPublicEventById(id: string) {
    const event = await repo.getById(id);
    if (event.visibility !== 'PUBLIC') {
      throw { kind: 'not-found', message: 'Event not found or not public.' };
    }
    return event;
  }
};
