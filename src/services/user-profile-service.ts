import { doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

import { getFirebaseFirestore } from '@/lib/firebase';
import type { AccountStatus, AuthUser, RoleName } from '@/types/auth';
import type { AppError } from '@/types/common';

const USERS_COLLECTION = 'users';

/**
 * Shape of `users/{uid}` in Firestore. Deliberately does NOT duplicate
 * authentication credentials (password, provider tokens) - those live only
 * in Firebase Authentication. This is the application-specific profile
 * layered on top of it (see Layer 1 rule: use Firebase Auth for identity,
 * Firestore for profile/organizational data).
 */
export interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  accountStatus: AccountStatus;
  churchId: string | null;
  role: RoleName;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

function requireDb() {
  const db = getFirebaseFirestore();
  if (!db) throw { kind: 'network', message: 'Firebase is not configured.' } satisfies AppError;
  return db;
}

function toMillis(value: Timestamp | null | undefined): number | null {
  return value ? value.toMillis() : null;
}

/**
 * Creates the Firestore profile for a brand-new account.
 *
 * Every new account is created with `role: "member"` and
 * `accountStatus: "pending"` - both hardcoded here, never taken from
 * caller input, so nothing upstream of this function can request a
 * privileged role for itself. Firestore rules independently re-enforce
 * the same defaults (see firestore.rules `isValidNewUserDoc`), so even a
 * client that bypasses this service can't create a doc with a different
 * role/status.
 */
export async function createUserProfile(params: {
  uid: string;
  email: string | null;
  displayName: string;
  churchId: string;
}): Promise<void> {
  const db = requireDb();
  const ref = doc(db, USERS_COLLECTION, params.uid);
  const profile: Omit<UserProfileDoc, 'createdAt' | 'updatedAt'> & { createdAt: unknown; updatedAt: unknown } = {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    photoURL: null,
    accountStatus: 'pending',
    churchId: params.churchId,
    role: 'member',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, profile);
}

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const db = requireDb();
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snapshot.exists() ? (snapshot.data() as UserProfileDoc) : null;
}

/** Client-updatable subset of the profile - anything security-relevant
 * (role, accountStatus, churchId) is intentionally excluded from this
 * type; see `activateVerifiedAccount` for the one narrow, rule-enforced
 * exception. */
export interface UpdatableProfileFields {
  displayName?: string;
  photoURL?: string | null;
}

export async function updateOwnProfile(uid: string, fields: UpdatableProfileFields): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, USERS_COLLECTION, uid), { ...fields, updatedAt: serverTimestamp() });
}

/**
 * Transitions a user's own account from "pending" to "active" once their
 * email is verified. This is the one client-initiated accountStatus write
 * allowed anywhere in the app - firestore.rules only permits it when
 * `request.auth.token.email_verified == true` on the caller's own ID
 * token (a claim Firebase Auth controls, not the client), the document is
 * currently "pending", and no other field changes. Promotion beyond
 * "active" (granting a leadership/admin role) is a separate, deliberately
 * unimplemented step reserved for the HRM/church-administration review
 * flow in a later layer.
 */
export async function activateVerifiedAccount(uid: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    accountStatus: 'active',
    updatedAt: serverTimestamp(),
  });
}

/** Merges a Firebase Auth user with their Firestore profile into the
 * single `AuthUser` shape the rest of the app consumes. */
export function toAuthUser(firebaseUser: FirebaseUser, profile: UserProfileDoc | null): AuthUser {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: profile?.displayName ?? firebaseUser.displayName,
    photoUrl: profile?.photoURL ?? firebaseUser.photoURL,
    createdAt: toMillis(profile?.createdAt) ?? (firebaseUser.metadata.creationTime ? Date.parse(firebaseUser.metadata.creationTime) : null),
    lastSignInAt: firebaseUser.metadata.lastSignInTime ? Date.parse(firebaseUser.metadata.lastSignInTime) : null,
    accountStatus: profile?.accountStatus ?? 'pending',
    churchId: profile?.churchId ?? null,
    role: profile?.role ?? 'member',
  };
}
