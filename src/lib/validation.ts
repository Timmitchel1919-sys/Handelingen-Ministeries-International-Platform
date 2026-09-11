/**
 * Client-side validation for authentication/profile input.
 *
 * These are the first line of defense only (fast feedback, no round trip);
 * they are not a substitute for server-side enforcement. Firestore rules
 * (see firestore.rules) independently re-validate anything security depends
 * on - a client passing these checks is never trusted on its own.
 */
export interface FieldValidationResult {
  valid: boolean;
  errorKey?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// At least 8 characters, one letter and one number. Communicated to the
// user via auth.passwordRequirements (see i18n locales) - keep both in sync.
const PASSWORD_MIN_LENGTH = 8;

export function validateEmail(value: string): FieldValidationResult {
  if (!value.trim()) return { valid: false, errorKey: 'auth.validation.emailRequired' };
  if (!EMAIL_PATTERN.test(value.trim())) return { valid: false, errorKey: 'auth.validation.emailInvalid' };
  return { valid: true };
}

export function validatePassword(value: string): FieldValidationResult {
  if (!value) return { valid: false, errorKey: 'auth.validation.passwordRequired' };
  if (value.length < PASSWORD_MIN_LENGTH) return { valid: false, errorKey: 'auth.validation.passwordTooShort' };
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return { valid: false, errorKey: 'auth.validation.passwordTooWeak' };
  }
  return { valid: true };
}

export function validatePasswordConfirmation(password: string, confirmation: string): FieldValidationResult {
  if (!confirmation) return { valid: false, errorKey: 'auth.validation.confirmPasswordRequired' };
  if (password !== confirmation) return { valid: false, errorKey: 'auth.validation.passwordsDoNotMatch' };
  return { valid: true };
}

export function validateDisplayName(value: string): FieldValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, errorKey: 'auth.validation.displayNameRequired' };
  if (trimmed.length < 2) return { valid: false, errorKey: 'auth.validation.displayNameTooShort' };
  if (trimmed.length > 80) return { valid: false, errorKey: 'auth.validation.displayNameTooLong' };
  return { valid: true };
}

/** Firestore auto-IDs are 20 url-safe base64 characters; validating the
 * shape client-side catches obviously-wrong values before a Firestore read
 * that would otherwise just come back "not found". Existence/active-status
 * of the church itself is still verified against Firestore separately. */
export function isValidChurchIdFormat(value: string): boolean {
  return /^[A-Za-z0-9_-]{10,64}$/.test(value);
}

export { PASSWORD_MIN_LENGTH };
