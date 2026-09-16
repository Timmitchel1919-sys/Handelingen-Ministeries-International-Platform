import type {
  BaseEntity,
  EntityStatus,
} from './common';

export type LeaderRole =
  | 'pastor'
  | 'elder'
  | 'deacon'
  | 'ministry-leader'
  | 'department-leader'
  | 'administrator';

export interface Leader extends BaseEntity {
  churchId: string;

  memberId?: string;

  userId?: string;

  firstName: string;

  lastName: string;

  displayName: string;

  email?: string;

  phone?: string;

  role: LeaderRole;

  ministryIds: string[];

  departmentIds: string[];

  photoUrl?: string;

  bio?: string;

  status: EntityStatus;

  startDate?: string;

  endDate?: string;
}