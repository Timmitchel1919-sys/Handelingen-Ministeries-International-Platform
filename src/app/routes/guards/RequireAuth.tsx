import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';

/**
 * Route guard: authenticated users only.
 *
 * Used as a pathless layout route wrapping everything that requires being
 * signed in but not necessarily verified (e.g. /profile) - see
 * app/routes/AppRoutes.tsx. Unauthenticated visitors are redirected to
 * /login with the attempted location preserved in `state.from`, so login
 * can send them back afterwards.
 */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return <LoadingState />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
