import { where, serverTimestamp, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { Ministry } from '@/types/ministry';

const repo = new FirestoreRepository<Omit<Ministry, 'id'>>('ministries');

export const ministryService = {
  async getById(churchId: string, id: string) {
    const ministry = await repo.getById(id);
    if (ministry.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Ministry not found.' };
    }
    return ministry;
  },

  async list(churchId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('churchId', '==', churchId),
      where('status', 'in', ['active', 'inactive']),
      ...constraints
    ], 100);
  },

  async create(data: Omit<Ministry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy' | 'archivedAt'>, actorUid: string) {
    return repo.create({
      ...data,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: actorUid,
      updatedBy: actorUid,
      deletedAt: null,
      deletedBy: null,
      archivedAt: null,
    });
  },

  async update(churchId: string, id: string, data: Partial<Omit<Ministry, 'id' | 'createdAt' | 'createdBy' | 'churchId'>>, actorUid: string) {
    // Ensure it belongs to church
    await this.getById(churchId, id);

    return repo.update(id, {
      ...data,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },

  async archive(churchId: string, id: string, actorUid: string) {
    // Ensure it belongs to church
    await this.getById(churchId, id);

    return repo.update(id, {
      status: 'archived',
      archivedAt: serverTimestamp() as any,
      deletedAt: serverTimestamp() as any,
      deletedBy: actorUid,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },
};
