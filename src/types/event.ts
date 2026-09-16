import type {
  BaseEntity,
  EntityStatus,
} from './common';

export type EventType =
  | 'service'
  | 'bible-study'
  | 'prayer'
  | 'conference'
  | 'youth'
  | 'outreach'
  | 'meeting'
  | 'other';

export interface ChurchEvent extends BaseEntity {
  churchId: string;

  title: string;

  description?: string;

  type: EventType;

  startAt: string;

  endAt: string;

  location?: {
    name?: string;
    address?: string;
    onlineUrl?: string;
  };

  organizerId?: string;

  ministryIds: string[];

  departmentIds: string[];

  capacity?: number;

  registrationRequired: boolean;

  status: EntityStatus;

  imageUrl?: string;
}