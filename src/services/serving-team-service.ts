import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { ServingTeam, ServingRole } from '@/types/layer11';

const teamRepo = new FirestoreRepository<Omit<ServingTeam, 'id'>>('servingTeams');
const roleRepo = new FirestoreRepository<Omit<ServingRole, 'id'>>('servingRoles');

export const servingTeamService = {
  async getServingTeamById(churchId: string, id: string) {
    const team = await teamRepo.getById(id);
    if (team.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Serving team not found.' };
    }
    return team;
  },

  async getServingTeams(churchId: string, constraints: QueryConstraint[] = []) {
    return teamRepo.list([
      where('churchId', '==', churchId),
      ...constraints
    ], 100);
  },

  async createServingTeam(churchId: string, data: Omit<ServingTeam, 'id' | 'churchId' | 'createdAt' | 'updatedAt'>) {
    return teamRepo.create({
      ...data,
      churchId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },

  async updateServingTeam(churchId: string, id: string, data: Partial<Omit<ServingTeam, 'id' | 'createdAt' | 'churchId'>>) {
    await this.getServingTeamById(churchId, id);

    return teamRepo.update(id, {
      ...data,
      updatedAt: Date.now(),
    });
  },

  async getServingRoleById(churchId: string, id: string) {
    const role = await roleRepo.getById(id);
    if (role.churchId !== churchId) {
      throw { kind: 'not-found', message: 'Serving role not found.' };
    }
    return role;
  },

  async addServingRole(churchId: string, teamId: string, data: Omit<ServingRole, 'id' | 'churchId' | 'teamId'>) {
    // Verify team belongs to church
    await this.getServingTeamById(churchId, teamId);

    return roleRepo.create({
      ...data,
      churchId,
      teamId,
    });
  },

  async getServingRoles(churchId: string, teamId: string, constraints: QueryConstraint[] = []) {
    // Verify team belongs to church
    await this.getServingTeamById(churchId, teamId);

    return roleRepo.list([
      where('churchId', '==', churchId),
      where('teamId', '==', teamId),
      ...constraints
    ], 500);
  },

  async getServingRolesByChurch(churchId: string, constraints: QueryConstraint[] = []) {
    return roleRepo.list([
      where('churchId', '==', churchId),
      ...constraints
    ], 500);
  }
};
