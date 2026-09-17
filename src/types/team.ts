import type { BaseEntity, EntityStatus, FirestoreTimestamp } from './common';

export interface Team extends BaseEntity {
  churchId: string;
  ministryId?: string | null;
  departmentId?: string | null;

  name: string;
  description?: string;

  status: EntityStatus;

  leaderMemberId?: string;
  memberCount: number;

  archivedAt?: FirestoreTimestamp | null;
}
