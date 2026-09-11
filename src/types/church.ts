/**
 * Church (tenant) foundation types.
 *
 * The church is the platform's primary organizational boundary - every
 * membership, permission check and Firestore rule that needs to isolate
 * one congregation's data from another's keys off `churchId`, never a
 * display name (names change, aren't unique, and can't safely gate access).
 */
export type ChurchStatus = 'active' | 'inactive';

export interface Church {
  id: string;
  name: string;
  status: ChurchStatus;
  createdAt: number | null;
  updatedAt: number | null;
}

/** The church a user is currently scoped to. Deliberately minimal at
 * Layer 1 - later layers may enrich this (branch/campus, timezone, ...)
 * without changing its identifying field. */
export interface ChurchContext {
  churchId: string;
  churchName: string;
  churchStatus: ChurchStatus;
}
