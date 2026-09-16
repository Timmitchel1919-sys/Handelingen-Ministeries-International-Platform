import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/features/auth/AuthContext';
import type { AuthAppError } from '@/lib/auth-errors';
import { refreshCurrentUser, resendVerificationEmail, signOutCurrentUser } from '@/services/auth-service';

/**
 * Email-verification gate (Layer 1 spec section 8).
 *
 * Reached by an authenticated-but-unverified user (see
 * app/routes/guards/RequireVerified.tsx). Offers resending the
 * verification email and manually re-checking status - Firebase does not
 * push verification events to an open session, so the user must trigger a
 * reload of their own Auth record after clicking the email link.
 */
export function VerifyEmailPage() {
  const { t } = useTranslation();
  const { firebaseUser, user, refreshProfile } = useAuth();

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  if (user?.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  const handleResend = async () => {
    setIsResending(true);
    setMessage(null);
    try {
      await resendVerificationEmail(firebaseUser);
      setMessage({ tone: 'success', text: t('auth.verifyEmail.resendSuccess') });
    } catch (cause) {
      setMessage({ tone: 'error', text: t((cause as AuthAppError).messageKey) });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheck = async () => {
    setIsChecking(true);
    setMessage(null);
    try {
      await refreshCurrentUser(firebaseUser);
      await refreshProfile();
      if (!firebaseUser.emailVerified) {
        setMessage({ tone: 'error', text: t('auth.verifyEmail.stillNotVerified') });
      }
    } catch (cause) {
      setMessage({ tone: 'error', text: t((cause as AuthAppError).messageKey) });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.verifyEmail.title')}
      description={t('auth.verifyEmail.description', { email: firebaseUser.email })}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-surface/20 text-white">
          <Icon name="notifications" size={28} />
        </span>

        {message && (
          <p
            role="status"
            className={`w-full rounded-md px-3 py-2 text-sm text-white ${message.tone === 'error' ? 'bg-danger/30' : 'bg-secondary/30'}`}
          >
            {message.text}
          </p>
        )}

        <div className="flex w-full flex-col gap-3">
          <Button onClick={handleCheck} isLoading={isChecking} size="lg">
            {t('auth.verifyEmail.checkStatus')}
          </Button>
          <Button onClick={handleResend} isLoading={isResending} variant="outline" size="lg" className="border-white/40 text-white hover:bg-surface/10">
            {t('auth.verifyEmail.resend')}
          </Button>
          <Button onClick={() => void signOutCurrentUser()} variant="ghost" size="sm" className="text-white/85 hover:bg-surface/10">
            {t('common.signOut')}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
