import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { Group, GroupMembership } from '@/types/layer11';

const groupRepo = new FirestoreRepository<Omit<Group, 'id'>>('groups');
const membershipRepo = new FirestoreRepository<Omit<GroupMembership, 'id'>>('groupMemberships');

export const groupService = {
  async getGroupById(churchId: string, id: string) {
    const group = await groupRepo.getById(id);
    if (group.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Group not found.' };
    }
    return group;
  },

  async getGroups(churchId: string, constraints: QueryConstraint[] = []) {
    return groupRepo.list([
      where('churchId', '==', churchId),
      ...constraints
    ], 100);
  },

  async createGroup(churchId: string, data: Omit<Group, 'id' | 'churchId' | 'createdAt' | 'updatedAt'>) {
    return groupRepo.create({
      ...data,
      churchId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },

  async updateGroup(churchId: string, id: string, data: Partial<Omit<Group, 'id' | 'createdAt' | 'churchId'>>) {
    await this.getGroupById(churchId, id);

    return groupRepo.update(id, {
      ...data,
      updatedAt: Date.now(),
    });
  },

  async addGroupMember(churchId: string, groupId: string, data: Omit<GroupMembership, 'id' | 'churchId' | 'groupId' | 'joinedAt'>) {
    // Verify group belongs to church
    await this.getGroupById(churchId, groupId);

    return membershipRepo.create({
      ...data,
      churchId,
      groupId,
      joinedAt: Date.now(),
    });
  },

  async removeGroupMember(churchId: string, groupId: string, membershipId: string) {
    const membership = await membershipRepo.getById(membershipId);
    if (membership.churchId !== churchId || membership.groupId !== groupId) {
      throw { kind: 'not-found', message: 'Group membership not found.' };
    }
    
    return membershipRepo.remove(membershipId);
  },

  async getGroupMembers(churchId: string, groupId: string, constraints: QueryConstraint[] = []) {
    // Verify group belongs to church
    await this.getGroupById(churchId, groupId);

    return membershipRepo.list([
      where('churchId', '==', churchId),
      where('groupId', '==', groupId),
      ...constraints
    ], 500);
  }
};
