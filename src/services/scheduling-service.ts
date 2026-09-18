import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { ServiceAssignment, AssignmentStatus } from '@/types/layer11';

const assignmentRepo = new FirestoreRepository<Omit<ServiceAssignment, 'id'>>('serviceAssignments');

export const schedulingService = {
  async getAssignmentById(churchId: string, id: string) {
    const assignment = await assignmentRepo.getById(id);
    if (assignment.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Service assignment not found.' };
    }
    return assignment;
  },

  async createAssignment(churchId: string, data: Omit<ServiceAssignment, 'id' | 'churchId' | 'assignedAt'>) {
    return assignmentRepo.create({
      ...data,
      churchId,
      assignedAt: Date.now(),
    });
  },

  async updateAssignmentStatus(churchId: string, assignmentId: string, status: AssignmentStatus, reason?: string) {
    await this.getAssignmentById(churchId, assignmentId);

    const updateData: Partial<ServiceAssignment> = { status };
    if (reason !== undefined) {
      updateData.declinedReason = reason;
    }

    return assignmentRepo.update(assignmentId, updateData);
  },

  async getAssignmentsForEvent(churchId: string, eventId: string, constraints: QueryConstraint[] = []) {
    return assignmentRepo.list([
      where('churchId', '==', churchId),
      where('eventId', '==', eventId),
      ...constraints
    ], 500);
  },

  async getAssignmentsForMember(churchId: string, memberId: string, constraints: QueryConstraint[] = []) {
    return assignmentRepo.list([
      where('churchId', '==', churchId),
      where('memberId', '==', memberId),
      ...constraints
    ], 500);
  },

  async deleteAssignment(churchId: string, id: string) {
    await this.getAssignmentById(churchId, id);
    return assignmentRepo.remove(id);
  }
};
