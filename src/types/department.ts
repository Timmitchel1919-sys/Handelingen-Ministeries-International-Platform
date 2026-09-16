import type {
  BaseEntity,
  EntityStatus,
} from './common';

export interface Department extends BaseEntity {
  churchId: string;

  ministryId?: string;

  name: string;

  description?: string;

  leaderIds: string[];

  status: EntityStatus;

  sortOrder: number;
}