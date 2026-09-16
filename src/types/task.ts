import type {
  BaseEntity,
  EntityStatus,
} from './common';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface ChurchTask extends BaseEntity {
  churchId: string;

  title: string;

  description?: string;

  assignedTo?: string;

  assignedBy?: string;

  priority: TaskPriority;

  status: TaskStatus;

  dueDate?: string;

  ministryId?: string;

  departmentId?: string;

  completedAt?: string;

  statusLabel?: EntityStatus;
}