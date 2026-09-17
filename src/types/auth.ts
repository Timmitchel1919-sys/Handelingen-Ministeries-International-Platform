/**
 * Authentication & authorization foundation types.
 *
 * Layer 1 replaces the Layer 0 placeholder (a Firestore-driven `Role[]`
 * that always resolved empty) with the concrete model the Master Build
 * Prompt specifies: a single `role` string per user, whose permissions are
 * looked up from a centrally-defined, client-immutable map (see
 * `src/lib/authorization.ts`). Only `role` is ever stored on the user
 * profile - permissions themselves are never written to Firestore or
 * assigned by client code.
 */

/** Account lifecycle state. A brand-new account is always `pending` -
 * nothing in this codebase may default a new account to `active`. */
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'disabled';

/** Centrally-defined role catalog. Do not scatter role string literals
 * elsewhere - import this type (and `ROLE_PERMISSIONS`) instead. */
export type RoleName =
  | 'member'
  | 'leader'
  | 'ministry_leader'
  | 'church_admin'
  | 'church_pastor'
  | 'super_admin';

/** A signed-in platform user: Firebase Auth identity merged with the
 * Firestore `users/{uid}` application profile (see UserProfileDoc). */
export interface AuthUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoUrl: string | null;
  createdAt: number | null;
  lastSignInAt: number | null;
  accountStatus: AccountStatus;
  /** The church/ministry this user's account is scoped to, for multi-tenancy. */
  churchId: string | null;
  role: RoleName;
}

/** Resources are the nouns permissions are checked against. */
export type PermissionResource =
  | 'dashboard'
  | 'organization'
  | 'ministries'
  | 'departments'
  | 'teams'
  | 'organizationMembers'
  | 'leadership'
  | 'members'
  | 'leaders'
  | 'events'
  | 'documents'
  | 'tasks'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'hrm'
  | 'church'
  | 'users'
  | 'registrations'
  | 'households'
  | 'transfers';

/** Actions are the verbs permissions are checked against. */
export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'manage';

/** A permission is always resource + action, e.g. "members.create". */
export type Permission = `${PermissionResource}.${PermissionAction}`;

export interface AuthState {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  user: AuthUser | null;
}

/** Helper to build a permission string with type safety at call sites. */
export function permission(resource: PermissionResource, action: PermissionAction): Permission {
  return `${resource}.${action}`;
}
