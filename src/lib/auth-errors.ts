import { FirebaseError } from 'firebase/app';

import type { AppError } from '@/types/common';

/**
 * Maps Firebase Authentication error codes to a translation key and a
 * normalized `AppError`, so the UI never shows a raw
 * "Firebase: Error (auth/invalid-credential)." string to a user (see Layer
 * 0 error-handling rule: no raw technical errors).
 *
 * The translation key resolves through the `auth` i18n namespace - see
 * i18n/locales/{nl,en}/common.json under `auth.errors.*`.
 */
const CODE_TO_KEY: Record<string, string> = {
  'auth/invalid-credential': 'auth.errors.invalidCredential',
  'auth/invalid-email': 'auth.errors.invalidEmail',
  'auth/user-disabled': 'auth.errors.accountDisabled',
  'auth/user-not-found': 'auth.errors.invalidCredential',
  'auth/wrong-password': 'auth.errors.invalidCredential',
  'auth/email-already-in-use': 'auth.errors.emailInUse',
  'auth/weak-password': 'auth.errors.weakPassword',
  'auth/too-many-requests': 'auth.errors.tooManyRequests',
  'auth/network-request-failed': 'auth.errors.network',
  'auth/requires-recent-login': 'auth.errors.requiresRecentLogin',
  'auth/expired-action-code': 'auth.errors.expiredCode',
  'auth/invalid-action-code': 'auth.errors.invalidCode',
  'auth/popup-closed-by-user': 'auth.errors.popupClosed',
};

export interface AuthAppError extends AppError {
  /** i18n key resolving to a user-facing message; always set for auth
   * errors so callers never need their own fallback copy. */
  messageKey: string;
}

export function toAuthError(cause: unknown): AuthAppError {
  const code = cause instanceof FirebaseError ? cause.code : undefined;
  const messageKey = (code && CODE_TO_KEY[code]) || 'auth.errors.unknown';

  let kind: AppError['kind'] = 'unknown';
  if (code === 'auth/network-request-failed') kind = 'network';
  else if (code === 'auth/user-disabled') kind = 'authorization';
  else if (code?.startsWith('auth/')) kind = 'auth';

  return { kind, message: messageKey, messageKey, cause };
}
