import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  type User as FirebaseUser,
} from 'firebase/auth';

import { toAuthError } from '@/lib/auth-errors';
import { getFirebaseAuth } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/services/user-profile-service';
import { validateActiveChurch } from '@/services/church-service';
import { validateDisplayName, validateEmail, validatePassword } from '@/lib/validation';
import { createMemberRegistration } from '@/services/registration-service';
import type { MemberRegistration } from '@/types/registration';

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

export async function signInWithGoogle(churchId?: string, rememberMe = true): Promise<FirebaseUser> {
  const auth = requireAuth();

  try {
    if (churchId && !await validateActiveChurch(churchId)) {
      throw { messageKey: 'auth.selectChurch.noLongerActive', kind: 'validation' };
    }
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const credential = await signInWithPopup(auth, provider);
    if (churchId && !await getUserProfile(credential.user.uid)) {
      await createUserProfile({ uid: credential.user.uid, email: credential.user.email,
        displayName: credential.user.displayName?.trim().slice(0, 80) || 'Google user', churchId });
    }

    return credential.user;
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export type RegistrationFormPayload = {
  email: string;
  password: string;
  churchId: string;
} & Omit<MemberRegistration, 'id' | 'uid' | 'churchId' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'schemaVersion' | 'email'>;

export async function registerWithEmail(params: RegistrationFormPayload): Promise<FirebaseUser> {
  const auth = requireAuth();
  try {
    const displayName = `${params.firstName} ${params.lastName}`.trim();
    for (const result of [validateEmail(params.email), validatePassword(params.password), validateDisplayName(displayName)]) {
      if (!result.valid) throw { kind: 'validation', messageKey: result.errorKey };
    }
    if (!await validateActiveChurch(params.churchId)) {
      throw { kind: 'validation', messageKey: 'auth.selectChurch.noLongerActive' };
    }
    const existingUser = auth.currentUser;
    const credential = existingUser?.email?.toLowerCase() === params.email.trim().toLowerCase()
      ? { user: existingUser }
      : await createUserWithEmailAndPassword(auth, params.email.trim(), params.password);
    await updateProfile(credential.user, { displayName });
    if (!await getUserProfile(credential.user.uid)) {
      await createUserProfile({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName,
        churchId: params.churchId,
      });
    }
    
    // Create member registration
    await createMemberRegistration({
      uid: credential.user.uid,
      churchId: params.churchId,
      email: params.email.trim(),
      firstName: params.firstName,
      lastName: params.lastName,
      dateOfBirth: params.dateOfBirth,
      gender: params.gender,
      maritalStatus: params.maritalStatus,
      isBaptized: params.isBaptized,
      hasChildren: params.hasChildren,
      children: params.children,
      memberType: params.memberType,
      country: params.country,
      district: params.district,
      phone: params.phone,
      emergencyContact1: params.emergencyContact1,
      emergencyContact2: params.emergencyContact2,
      ministryInterest: params.ministryInterest,
      howDidYouHear: params.howDidYouHear,
    });

    await sendEmailVerification(credential.user);
    return credential.user;
  } catch (cause) {
    throw toAuthError(cause);
  }
}

export async function signInWithEmail(email: string, password: string, rememberMe = true): Promise<FirebaseUser> {
  const auth = requireAuth();
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
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
    await user.getIdToken(true);
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
