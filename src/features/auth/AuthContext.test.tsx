import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

const mocks = vi.hoisted(() => ({
  auth: { currentUser: null as unknown },
  listener: null as unknown,
  profileListener: null as unknown,
  getProfile: vi.fn(),
}));
vi.mock('firebase/auth', () => ({ onIdTokenChanged: (_auth: unknown, listener: unknown) => { mocks.listener = listener; return vi.fn(); } }));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), onSnapshot: (_doc: unknown, listener: unknown) => { mocks.profileListener = listener; return vi.fn(); } }));
vi.mock('@/lib/firebase', () => ({ getFirebaseAuth: () => mocks.auth, getFirebaseFirestore: () => ({}) }));
vi.mock('@/services/user-profile-service', () => ({
  getUserProfile: mocks.getProfile,
  activateVerifiedAccount: vi.fn().mockResolvedValue(undefined),
  toAuthUser: (user: { uid: string }, profile: { accountStatus: string } | null) => ({ id: user.uid, accountStatus: profile?.accountStatus ?? 'pending' }),
}));
function Probe() {
  const { status, user } = useAuth();
  return <div>{status}:{user?.id}:{user?.accountStatus}</div>;
}
function emit(user: unknown) {
  mocks.auth.currentUser = user;
  (mocks.listener as (value: unknown) => void)(user);
}
describe('AuthProvider session synchronization', () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.auth.currentUser = null; });
  it('ignores a profile response that arrives after logout', async () => {
    let resolve!: (value: unknown) => void;
    mocks.getProfile.mockReturnValue(new Promise(done => { resolve = done; }));
    render(<AuthProvider><Probe /></AuthProvider>);
    act(() => emit({ uid: 'alice', emailVerified: false }));
    act(() => emit(null));
    await act(async () => resolve({ accountStatus: 'active' }));
    expect(screen.getByText('unauthenticated::')).toBeInTheDocument();
  });
  it('updates account state when an administrator suspends a user', async () => {
    mocks.getProfile.mockResolvedValue({ accountStatus: 'active' });
    render(<AuthProvider><Probe /></AuthProvider>);
    act(() => emit({ uid: 'alice', emailVerified: true }));
    await waitFor(() => expect(screen.getByText('authenticated:alice:active')).toBeInTheDocument());
    act(() => (mocks.profileListener as (value: unknown) => void)({ exists: () => true, data: () => ({ accountStatus: 'suspended' }) }));
    expect(screen.getByText('authenticated:alice:suspended')).toBeInTheDocument();
  });
});
