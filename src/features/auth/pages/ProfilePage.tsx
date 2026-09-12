import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthContext';
import { logAuditEvent } from '@/services/audit-service';
import { signOutCurrentUser } from '@/services/auth-service';

const STATUS_TONE = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
  disabled: 'danger',
} as const;

/** Authenticated-only page (does not require email verification - see
 * Layer 1 spec section 9) showing the merged Firebase Auth + Firestore
 * profile and a sign-out action. */
export function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const handleSignOut = async () => {
    await logAuditEvent({
      actorUid: user.id,
      actorRole: user.role,
      action: 'sign-out',
      resource: 'auth',
      resourceId: user.id,
      churchId: user.churchId,
    });
    await signOutCurrentUser();
    navigate('/', { replace: true });
  };

  return (
    <PageContainer title={t('common.profile')}>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar name={user.displayName ?? user.email ?? 'User'} src={user.photoUrl} size={44} />
            <span>{user.displayName ?? user.email}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <Row label={t('auth.email')} value={user.email ?? '-'} />
          <Row
            label={t('auth.verifyEmail.title')}
            value={
              <Badge tone={user.emailVerified ? 'success' : 'warning'}>
                {user.emailVerified ? t('auth.verified') : t('auth.verificationRequired')}
              </Badge>
            }
          />
          <Row label={t('auth.accountStatus')} value={<Badge tone={STATUS_TONE[user.accountStatus]}>{t(`auth.status.${user.accountStatus}`)}</Badge>} />
          <Row label={t('auth.role')} value={t(`auth.roles.${user.role}`)} />
          <Row label={t('navigation.ministries')} value={user.churchId ?? '-'} />

          <div className="pt-3">
            <Button variant="outline" onClick={() => void handleSignOut()}>
              {t('common.signOut')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border)] pb-2 last:border-0">
      <span className="text-muted)]">{label}</span>
      <span className="font-medium text-text)]">{value}</span>
    </div>
  );
}
