import { where, serverTimestamp, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { Department } from '@/types/department';

const repo = new FirestoreRepository<Omit<Department, 'id'>>('departments');

export const departmentService = {
  async getById(churchId: string, id: string) {
    const department = await repo.getById(id);
    if (department.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Department not found.' };
    }
    return department;
  },

  async list(churchId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('churchId', '==', churchId),
      where('status', 'in', ['active', 'inactive']),
      ...constraints
    ], 100);
  },

  async create(data: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy' | 'archivedAt'>, actorUid: string) {
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

  async update(churchId: string, id: string, data: Partial<Omit<Department, 'id' | 'createdAt' | 'createdBy' | 'churchId'>>, actorUid: string) {
    await this.getById(churchId, id);

    return repo.update(id, {
      ...data,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },

  async archive(churchId: string, id: string, actorUid: string) {
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
