import { describe, expect, it } from 'vitest';

import {
  isValidChurchIdFormat,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/lib/validation';

describe('validateEmail', () => {
  it('rejects an empty value', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('   ').valid).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(validateEmail('not-an-email').valid).toBe(false);
    expect(validateEmail('missing@domain').valid).toBe(false);
  });

  it('accepts a well-formed email', () => {
    expect(validateEmail('member@handelingen.church').valid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('rejects an empty password', () => {
    expect(validatePassword('').valid).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(validatePassword('abc123').valid).toBe(false);
  });

  it('rejects a password missing a letter or a number', () => {
    expect(validatePassword('12345678').valid).toBe(false);
    expect(validatePassword('abcdefgh').valid).toBe(false);
  });

  it('accepts a password with 8+ characters, a letter and a number', () => {
    expect(validatePassword('Password1').valid).toBe(true);
  });
});

describe('validatePasswordConfirmation', () => {
  it('rejects an empty confirmation', () => {
    expect(validatePasswordConfirmation('Password1', '').valid).toBe(false);
  });

  it('rejects a mismatched confirmation', () => {
    expect(validatePasswordConfirmation('Password1', 'Password2').valid).toBe(false);
  });

  it('accepts a matching confirmation', () => {
    expect(validatePasswordConfirmation('Password1', 'Password1').valid).toBe(true);
  });
});

describe('validateDisplayName', () => {
  it('rejects empty/whitespace-only names', () => {
    expect(validateDisplayName('').valid).toBe(false);
    expect(validateDisplayName('   ').valid).toBe(false);
  });

  it('rejects a single-character name', () => {
    expect(validateDisplayName('A').valid).toBe(false);
  });

  it('rejects an excessively long name', () => {
    expect(validateDisplayName('A'.repeat(81)).valid).toBe(false);
  });

  it('accepts a normal name', () => {
    expect(validateDisplayName('Jane Doe').valid).toBe(true);
  });
});

describe('isValidChurchIdFormat', () => {
  it('rejects obviously-wrong shapes', () => {
    expect(isValidChurchIdFormat('')).toBe(false);
    expect(isValidChurchIdFormat('short')).toBe(false);
    expect(isValidChurchIdFormat('has spaces in it')).toBe(false);
  });

  it('accepts a Firestore-auto-ID-shaped string', () => {
    expect(isValidChurchIdFormat('aBc123XYZ_-09876543')).toBe(true);
  });
});
