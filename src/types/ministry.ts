import type {
  BaseEntity,
  EntityStatus,
  FirestoreTimestamp,
} from './common';

export interface Ministry extends BaseEntity {
  churchId: string;
  name: string;
  code?: string;
  description?: string;
  
  status: EntityStatus;
  
  leaderMemberId?: string;
  assistantLeaderMemberIds?: string[];
  
  memberCount: number;
  
  archivedAt?: FirestoreTimestamp | null;
}