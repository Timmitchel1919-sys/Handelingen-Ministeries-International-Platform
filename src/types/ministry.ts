import type {
  BaseEntity,
  EntityStatus,
} from './common';

export interface Ministry extends BaseEntity {
  churchId: string;

  name: string;

  description?: string;

  leaderIds: string[];

  departmentIds: string[];

  status: EntityStatus;

  sortOrder: number;
}