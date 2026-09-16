import type {
  BaseEntity,
  EntityStatus,
} from './common';

export type DocumentCategory =
  | 'administrative'
  | 'financial'
  | 'membership'
  | 'leadership'
  | 'ministry'
  | 'event'
  | 'legal'
  | 'other';

export interface ChurchDocument extends BaseEntity {
  churchId: string;

  name: string;

  description?: string;

  category: DocumentCategory;

  fileName: string;

  storagePath: string;

  downloadUrl?: string;

  mimeType: string;

  sizeBytes: number;

  uploadedBy: string;

  status: EntityStatus;

  version: number;

  isConfidential: boolean;

  allowedRoles?: string[];

  tags: string[];
}