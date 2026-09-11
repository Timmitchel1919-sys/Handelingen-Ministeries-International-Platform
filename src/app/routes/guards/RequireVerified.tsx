import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/AuthContext';

/**
 * Route guard: authenticated AND emailVerified === true.
 *
 * Nest this inside `RequireAuth` (it assumes authentication already
 * passed - see AppRoutes.tsx) for every "protected platform area" route.
 * An authenticated-but-unverified user is sent to /verify-email rather
 * than /login, since they do have a valid session.
 */
export function RequireVerified() {
  const { user } = useAuth();

  if (!user?.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}
