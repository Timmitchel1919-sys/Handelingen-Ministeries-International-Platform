import { describe, expect, it } from 'vitest';

import { toAuthUser, type UserProfileDoc } from '@/services/user-profile-service';

function firebaseUserStub(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    uid: 'uid-1',
    email: 'jane@example.com',
    emailVerified: false,
    displayName: null,
    photoURL: null,
    metadata: { creationTime: undefined, lastSignInTime: undefined },
    ...overrides,
  } as unknown as Parameters<typeof toAuthUser>[0];
}

describe('toAuthUser', () => {
  it('defaults a brand-new account (no Firestore profile yet) to member/pending, never an elevated role', () => {
    const user = toAuthUser(firebaseUserStub(), null);
    expect(user.role).toBe('member');
    expect(user.accountStatus).toBe('pending');
    expect(user.churchId).toBeNull();
  });

  it('carries church context and role from the Firestore profile once it exists', () => {
    const profile: UserProfileDoc = {
      uid: 'uid-1',
      email: 'jane@example.com',
      displayName: 'Jane Doe',
      photoURL: null,
      accountStatus: 'active',
      churchId: 'church-123',
      role: 'leader',
      createdAt: null,
      updatedAt: null,
    };
    const user = toAuthUser(firebaseUserStub(), profile);
    expect(user.churchId).toBe('church-123');
    expect(user.role).toBe('leader');
    expect(user.accountStatus).toBe('active');
  });

  it('reflects the live Firebase emailVerified flag, not anything stored in the profile', () => {
    const verifiedUser = toAuthUser(firebaseUserStub({ emailVerified: true }), null);
    expect(verifiedUser.emailVerified).toBe(true);

    const unverifiedUser = toAuthUser(firebaseUserStub({ emailVerified: false }), null);
    expect(unverifiedUser.emailVerified).toBe(false);
  });
});
