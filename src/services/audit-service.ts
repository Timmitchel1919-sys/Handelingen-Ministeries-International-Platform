import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase';
import type { AuditLogEntry } from '@/types/audit';

const AUDIT_LOGS_COLLECTION = 'auditLogs';

/**
 * Writes one audit log entry. Layer 1 calls this only for auth-lifecycle
 * events (sign-up, sign-in, sign-out); administrative actions in later
 * layers (role changes, church management, HRM review decisions) should
 * call the same function rather than introducing a second logging path.
 *
 * Failures here are swallowed (logged to console, not thrown) - a logging
 * failure must never block the user-facing action it's recording.
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;

  try {
    await addDoc(collection(db, AUDIT_LOGS_COLLECTION), {
      ...entry,
      createdAt: serverTimestamp(),
    });
  } catch (cause) {
    console.error('[audit] Failed to write audit log entry', cause);
  }
}
