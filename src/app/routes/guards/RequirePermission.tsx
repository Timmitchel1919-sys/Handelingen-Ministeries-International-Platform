import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/features/auth/AuthContext';
import type { Permission } from '@/types/auth';
import { ErrorState } from '@/components/ui/ErrorState';

/**
 * Route guard: authenticated + verified (assumed already satisfied by
 * nesting inside RequireAuth/RequireVerified - see AppRoutes.tsx) AND
 * authorized for a specific permission.
 *
 * This is the "administrative routes must check both authentication AND
 * authorization" guard from the Layer 1 spec. Unlike RequireAuth/
 * RequireVerified it does not redirect - lacking a permission is a normal,
 * expected state (not "you're logged out"), so it renders an in-place
 * access-denied message instead of bouncing the user elsewhere.
 */
export function RequirePermission({ permission }: { permission: Permission }) {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();

  if (!hasPermission(permission)) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <ErrorState title={t('auth.accessDenied.title')} description={t('auth.accessDenied.description')} />
      </div>
    );
  }

  return <Outlet />;
}
