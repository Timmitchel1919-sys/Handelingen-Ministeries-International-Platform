import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  type User as FirebaseUser,
} from 'firebase/auth';

import { toAuthError } from '@/lib/auth-errors';
import { getFirebaseAuth } from '@/lib/firebase';
import { createUserProfile } from '@/services/user-profile-service';

/**
 * Thin, error-normalizing wrapper around Firebase Authentication.
 *
 * UI components call these functions - never `firebase/auth` directly -
 * so every failure surfaces as a translated `AuthAppError` (see
 * lib/auth-errors.ts) instead of a raw Firebase exception.
 */
function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw toAuthError({ code: 'auth/network-request-failed' });
  return auth;
}

export async function registerWithEmail(params: {
  email: string;
  password: string;
  displayName: string;
  churchId: string;
}): Promise<FirebaseUser> {
  const auth = requireAuth();
  try {
    const credential = await createUserWithEmailAndPassword(auth, params.email, params.password);
    await updateProfile(credential.user, { displayName: params.displayName });
    await createUserProfile({
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: params.displayName,
      churchId: params.churchId,
    });
    await sendEmailVerification(credential.user);
    return credential.user;
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const auth = requireAuth();
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function signOutCurrentUser(): Promise<void> {
  const auth = requireAuth();
  try {
    await firebaseSignOut(auth);
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function resendVerificationEmail(user: FirebaseUser): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (cause) {
    throw toAuthError(cause);
  }
}

/** Reloads the Firebase Auth user from the server so a just-clicked email
 * verification link is reflected in `user.emailVerified` without requiring
 * a full sign-out/sign-in. */
export async function refreshCurrentUser(user: FirebaseUser): Promise<FirebaseUser> {
  try {
    await reload(user);
    return user;
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const auth = requireAuth();
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function verifyPasswordResetCode(oobCode: string): Promise<string> {
  const auth = requireAuth();
  try {
    return await firebaseVerifyPasswordResetCode(auth, oobCode);
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
  const auth = requireAuth();
  try {
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
  } catch (cause) {
    throw toAuthError(cause);
  }
}
