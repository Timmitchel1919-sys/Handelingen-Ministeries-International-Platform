import type { PermissionAction, PermissionResource } from '@/types/auth';

/**
 * Audit-log foundation.
 *
 * Layer 1 only establishes the shape and a single write-path
 * (`logAuditEvent`, see src/services/audit-service.ts) used by
 * security-relevant auth events (sign-up, sign-in, sign-out). A full
 * administrative audit trail (who changed what member/document/event) is
 * built out alongside those features in later layers - this collection
 * and type are ready for it without a schema change.
 */
export interface AuditLogEntry {
  id?: string;
  actorUid: string;
  actorRole: string;
  action: PermissionAction | 'sign-in' | 'sign-out' | 'sign-up';
  resource: PermissionResource | 'auth';
  resourceId: string | null;
  churchId: string | null;
  createdAt: number | null;
}
