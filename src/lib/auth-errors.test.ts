import { FirebaseError } from 'firebase/app';
import { describe, expect, it } from 'vitest';

import { toAuthError } from '@/lib/auth-errors';

function firebaseError(code: string) {
  return new FirebaseError(code, `Firebase: Error (${code}).`);
}

describe('toAuthError', () => {
  it('maps invalid-credential to a translation key, never the raw Firebase message', () => {
    const error = toAuthError(firebaseError('auth/invalid-credential'));
    expect(error.messageKey).toBe('auth.errors.invalidCredential');
    expect(error.message).not.toContain('Firebase:');
  });

  it('maps a disabled account to an authorization-kind error', () => {
    const error = toAuthError(firebaseError('auth/user-disabled'));
    expect(error.messageKey).toBe('auth.errors.accountDisabled');
    expect(error.kind).toBe('authorization');
  });

  it('maps a network failure to a network-kind error', () => {
    const error = toAuthError(firebaseError('auth/network-request-failed'));
    expect(error.kind).toBe('network');
  });

  it('falls back to a generic, still-safe message for an unrecognized code', () => {
    const error = toAuthError(firebaseError('auth/some-new-code-we-do-not-map'));
    expect(error.messageKey).toBe('auth.errors.unknown');
  });

  it('falls back gracefully for a non-Firebase error (e.g. a plain network exception)', () => {
    const error = toAuthError(new Error('fetch failed'));
    expect(error.messageKey).toBe('auth.errors.unknown');
    expect(error.kind).toBe('unknown');
  });
});
