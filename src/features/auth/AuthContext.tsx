import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { can } from '@/lib/authorization';
import { getFirebaseAuth } from '@/lib/firebase';
import { activateVerifiedAccount, getUserProfile, toAuthUser, type UserProfileDoc } from '@/services/user-profile-service';
import type { AuthState, AuthUser, Permission } from '@/types/auth';

/**
 * Centralized authentication + authorization state.
 *
 * This is the ONLY place the app subscribes to Firebase Auth state - no
 * other component should call `onAuthStateChanged` directly (Layer 1 rule:
 * avoid duplicating authentication listeners). It merges the Firebase Auth
 * identity with the Firestore `users/{uid}` profile into one `AuthUser`
 * (see services/user-profile-service.ts), and exposes `hasPermission` so
 * UI code checks permissions instead of hardcoding role comparisons.
 */
interface AuthContextValue extends AuthState {
  /** The raw Firebase user, needed by auth pages that call Firebase APIs
   * directly (resend verification, reload). Prefer `user` everywhere else. */
  firebaseUser: FirebaseUser | null;
  hasPermission: (permission: Permission) => boolean;
  /** Re-reads the Firestore profile - call after an action that changes it
   * server-side (e.g. after verifying email) to refresh `user` without a
   * full page reload. */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadAuthUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
  let profile: UserProfileDoc | null = await getUserProfile(firebaseUser.uid);

  // The one client-initiated account-status transition this app performs:
  // pending -> active, once Firebase itself confirms the email is
  // verified. Firestore rules independently gate this on the caller's own
  // (server-issued) email_verified token claim - see firestore.rules.
  if (profile && profile.accountStatus === 'pending' && firebaseUser.emailVerified) {
    try {
      await activateVerifiedAccount(firebaseUser.uid);
      profile = { ...profile, accountStatus: 'active' };
    } catch (cause) {
      console.error('[auth] Failed to activate verified account', cause);
    }
  }

  return toAuthUser(firebaseUser, profile);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ status: 'unauthenticated', user: null });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextFirebaseUser) => {
      setFirebaseUser(nextFirebaseUser);

      if (!nextFirebaseUser) {
        setState({ status: 'unauthenticated', user: null });
        return;
      }

      setState({ status: 'loading', user: null });
      void loadAuthUser(nextFirebaseUser)
        .then((user) => setState({ status: 'authenticated', user }))
        .catch((cause) => {
          console.error('[auth] Failed to load user profile', cause);
          setState({ status: 'authenticated', user: toAuthUser(nextFirebaseUser, null) });
        });
    });

    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    const user = await loadAuthUser(firebaseUser);
    setState({ status: 'authenticated', user });
  }, [firebaseUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      firebaseUser,
      hasPermission: (permission) => {
        const [resource, action] = permission.split('.') as [Parameters<typeof can>[2], Parameters<typeof can>[1]];
        return can(state.user, action, resource);
      },
      refreshProfile,
    }),
    [state, firebaseUser, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
