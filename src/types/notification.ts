import type {
  BaseEntity,
} from './common';

export type NotificationType =
  | 'system'
  | 'event'
  | 'task'
  | 'membership'
  | 'document'
  | 'announcement';

export interface Notification
  extends BaseEntity {
  userId: string;

  churchId: string;

  title: string;

  message: string;

  type: NotificationType;

  read: boolean;

  readAt?: string;

  actionUrl?: string;
}