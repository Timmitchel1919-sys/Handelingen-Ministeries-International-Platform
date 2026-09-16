import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshCurrentUser, registerWithEmail, signInWithEmail, signInWithGoogle } from './auth-service';
const mocks = vi.hoisted(() => ({ auth: { currentUser: null as unknown }, create: vi.fn(), popup: vi.fn(), signIn: vi.fn(), persistence: vi.fn(), reload: vi.fn(), verify: vi.fn(), update: vi.fn(), profile: vi.fn(), createProfile: vi.fn(), church: vi.fn() }));
vi.mock('@/lib/firebase', () => ({ getFirebaseAuth: () => mocks.auth }));
vi.mock('@/services/church-service', () => ({ validateActiveChurch: mocks.church }));
vi.mock('@/services/user-profile-service', () => ({ getUserProfile: mocks.profile, createUserProfile: mocks.createProfile }));
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class { setCustomParameters() {} },
  browserLocalPersistence: 'local', browserSessionPersistence: 'session', setPersistence: mocks.persistence,
  createUserWithEmailAndPassword: mocks.create, signInWithPopup: mocks.popup, signInWithEmailAndPassword: mocks.signIn,
  reload: mocks.reload, sendEmailVerification: mocks.verify, updateProfile: mocks.update,
  confirmPasswordReset: vi.fn(), sendPasswordResetEmail: vi.fn(), signOut: vi.fn(), verifyPasswordResetCode: vi.fn(),
}));
const user = { uid: 'uid', email: 'person@example.com', displayName: 'Test Person', getIdToken: vi.fn() };
const input = { email: user.email, password: 'Password123', displayName: user.displayName, churchId: 'church-a' };
describe('authentication service', () => {
  beforeEach(() => {
    vi.clearAllMocks(); mocks.auth.currentUser = null;
    mocks.church.mockResolvedValue({ id: 'church-a' }); mocks.profile.mockResolvedValue(null);
    mocks.create.mockResolvedValue({ user }); mocks.popup.mockResolvedValue({ user }); mocks.signIn.mockResolvedValue({ user });
  });
  it('uses session persistence when remember me is unchecked', async () => {
    await signInWithEmail(user.email, 'Password123', false);
    expect(mocks.persistence).toHaveBeenCalledWith(mocks.auth, 'session');
  });
  it('does not create an auth account for an invalid church', async () => {
    mocks.church.mockResolvedValue(null);
    await expect(registerWithEmail(input)).rejects.toMatchObject({ messageKey: 'auth.selectChurch.noLongerActive' });
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it('creates a safe Google profile using the selected church', async () => {
    await signInWithGoogle('church-a');
    expect(mocks.createProfile).toHaveBeenCalledWith({ uid: user.uid, email: user.email, displayName: user.displayName, churchId: 'church-a' });
  });
  it('never overwrites an existing Google profile or church', async () => {
    mocks.profile.mockResolvedValue({ churchId: 'church-b' });
    await signInWithGoogle('church-a');
    expect(mocks.createProfile).not.toHaveBeenCalled();
  });
  it('recovers a partial registration in the existing session without creating another account', async () => {
    mocks.auth.currentUser = user;
    await registerWithEmail(input);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.createProfile).toHaveBeenCalledOnce();
  });
  it('refreshes the ID token after reloading verification state', async () => {
    await refreshCurrentUser(user as unknown as Parameters<typeof refreshCurrentUser>[0]);
    expect(user.getIdToken).toHaveBeenCalledWith(true);
  });
});
