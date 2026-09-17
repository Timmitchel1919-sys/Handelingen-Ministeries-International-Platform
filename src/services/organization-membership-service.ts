import { where, serverTimestamp, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { OrganizationMembership, LeadershipAssignment, OrganizationType } from '@/types/organization';

const membershipsRepo = new FirestoreRepository<Omit<OrganizationMembership, 'id'>>('organizationMemberships');
const leadershipRepo = new FirestoreRepository<Omit<LeadershipAssignment, 'id'>>('leadershipAssignments');

export const organizationMembershipService = {
  // Memberships
  async getMembershipById(churchId: string, id: string) {
    const membership = await membershipsRepo.getById(id);
    if (membership.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Membership not found.' };
    }
    return membership;
  },

  async listMemberships(churchId: string, organizationType: OrganizationType, organizationId: string, constraints: QueryConstraint[] = []) {
    return membershipsRepo.list([
      where('churchId', '==', churchId),
      where('organizationType', '==', organizationType),
      where('organizationId', '==', organizationId),
      ...constraints
    ], 100);
  },

  async listMembershipsByMember(churchId: string, memberId: string, constraints: QueryConstraint[] = []) {
    return membershipsRepo.list([
      where('churchId', '==', churchId),
      where('memberId', '==', memberId),
      ...constraints
    ], 100);
  },

  async assignMembership(data: Omit<OrganizationMembership, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>, actorUid: string) {
    return membershipsRepo.create({
      ...data,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: actorUid,
      updatedBy: actorUid,
      deletedAt: null,
      deletedBy: null,
    });
  },

  async updateMembership(churchId: string, id: string, data: Partial<Omit<OrganizationMembership, 'id' | 'createdAt' | 'createdBy' | 'churchId'>>, actorUid: string) {
    await this.getMembershipById(churchId, id);
    return membershipsRepo.update(id, {
      ...data,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },

  async endMembership(churchId: string, id: string, actorUid: string) {
    await this.getMembershipById(churchId, id);
    return membershipsRepo.update(id, {
      status: 'ended',
      endDate: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },

  // Leadership Assignments
  async getLeadershipAssignmentById(churchId: string, id: string) {
    const assignment = await leadershipRepo.getById(id);
    if (assignment.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Leadership assignment not found.' };
    }
    return assignment;
  },

  async listLeadershipAssignments(churchId: string, organizationType: OrganizationType, organizationId: string, constraints: QueryConstraint[] = []) {
    return leadershipRepo.list([
      where('churchId', '==', churchId),
      where('organizationType', '==', organizationType),
      where('organizationId', '==', organizationId),
      ...constraints
    ], 100);
  },

  async listLeadershipAssignmentsByMember(churchId: string, memberId: string, constraints: QueryConstraint[] = []) {
    return leadershipRepo.list([
      where('churchId', '==', churchId),
      where('memberId', '==', memberId),
      ...constraints
    ], 100);
  },

  async assignLeadership(data: Omit<LeadershipAssignment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>, actorUid: string) {
    return leadershipRepo.create({
      ...data,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: actorUid,
      updatedBy: actorUid,
      deletedAt: null,
      deletedBy: null,
    });
  },

  async updateLeadershipAssignment(churchId: string, id: string, data: Partial<Omit<LeadershipAssignment, 'id' | 'createdAt' | 'createdBy' | 'churchId'>>, actorUid: string) {
    await this.getLeadershipAssignmentById(churchId, id);
    return leadershipRepo.update(id, {
      ...data,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  },

  async endLeadershipAssignment(churchId: string, id: string, actorUid: string) {
    await this.getLeadershipAssignmentById(churchId, id);
    return leadershipRepo.update(id, {
      status: 'ended',
      endDate: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      updatedBy: actorUid,
    });
  }
};
