import { describe, expect, it } from 'vitest';

import { can, ROLE_PERMISSIONS } from '@/lib/authorization';
import type { AuthUser } from '@/types/auth';

function makeUser(overrides: Partial<AuthUser> = {}): Pick<AuthUser, 'role' | 'accountStatus'> {
  return { role: 'member', accountStatus: 'active', ...overrides };
}

describe('can', () => {
  it('denies a null user (unauthenticated)', () => {
    expect(can(null, 'read', 'dashboard')).toBe(false);
  });

  it('denies a user whose account is not active', () => {
    expect(can(makeUser({ accountStatus: 'pending', role: 'super_admin' }), 'read', 'dashboard')).toBe(false);
    expect(can(makeUser({ accountStatus: 'suspended' }), 'read', 'dashboard')).toBe(false);
    expect(can(makeUser({ accountStatus: 'disabled' }), 'read', 'dashboard')).toBe(false);
  });

  it('grants a member dashboard.read but not members.manage', () => {
    const member = makeUser({ role: 'member' });
    expect(can(member, 'read', 'dashboard')).toBe(true);
    expect(can(member, 'manage', 'members')).toBe(false);
    expect(can(member, 'manage', 'church')).toBe(false);
  });

  it('grants a church_admin broad management permissions', () => {
    const admin = makeUser({ role: 'church_admin' });
    expect(can(admin, 'manage', 'members')).toBe(true);
    expect(can(admin, 'manage', 'church')).toBe(true);
    expect(can(admin, 'manage', 'hrm')).toBe(true);
  });

  it('never lets a member self-escalate: a raw role check would be wrong here', () => {
    // Regression guard for "a client must never be able to promote
    // itself" (Layer 1 spec section 17): permissions come ONLY from the
    // static ROLE_PERMISSIONS map, never from anything else on the user
    // object, so mutating unrelated fields can't grant anything.
    const tamperedMember = { role: 'member', accountStatus: 'active', extra: 'super_admin' } as unknown as Pick<
      AuthUser,
      'role' | 'accountStatus'
    >;
    expect(can(tamperedMember, 'manage', 'church')).toBe(false);
  });

  it('grants super_admin every defined permission', () => {
    const superAdmin = makeUser({ role: 'super_admin' });
    for (const permission of ROLE_PERMISSIONS.church_admin) {
      const [resource, action] = permission.split('.') as [Parameters<typeof can>[2], Parameters<typeof can>[1]];
      expect(can(superAdmin, action, resource)).toBe(true);
    }
  });
});
