import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import type { AuthAppError } from '@/lib/auth-errors';
import { validatePassword, validatePasswordConfirmation } from '@/lib/validation';
import { confirmPasswordReset, verifyPasswordResetCode } from '@/services/auth-service';

type CodeStatus = 'checking' | 'valid' | 'invalid';

/**
 * Handles the link Firebase's password-reset email sends
 * (?mode=resetPassword&oobCode=...). The code is verified against
 * Firebase before showing the form - an expired/invalid code (Layer 1
 * spec section 8: "handle expired/invalid verification flows") shows a
 * dedicated error state instead of a broken form.
 */
export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode') ?? '';

  const [codeStatus, setCodeStatus] = useState<CodeStatus>('checking');
  const [email, setEmail] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setCodeStatus('invalid');
      return;
    }
    verifyPasswordResetCode(oobCode)
      .then((resolvedEmail) => {
        setEmail(resolvedEmail);
        setCodeStatus('valid');
      })
      .catch(() => setCodeStatus('invalid'));
  }, [oobCode]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordConfirmation(password, confirmPassword);
    setFieldErrors({ password: passwordResult.errorKey, confirmPassword: confirmResult.errorKey });
    if (!passwordResult.valid || !confirmResult.valid) return;

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(oobCode, password);
      setIsComplete(true);
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t('auth.resetPassword')} description={email ?? undefined}>
      {codeStatus === 'checking' && <LoadingState />}

      {codeStatus === 'invalid' && (
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <p>{t('auth.resetLinkInvalid')}</p>
          <Link to="/forgot-password" className="font-semibold underline">
            {t('auth.sendResetLink')}
          </Link>
        </div>
      )}

      {codeStatus === 'valid' && !isComplete && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t('auth.newPassword')}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password && t(fieldErrors.password)}
            hint={!fieldErrors.password ? t('auth.passwordRequirements') : undefined}
          />
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={fieldErrors.confirmPassword && t(fieldErrors.confirmPassword)}
          />
          {formError && (
            <p role="alert" className="rounded-md bg-white/20 px-3 py-2 text-sm text-white">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            {t('auth.resetPassword')}
          </Button>
        </form>
      )}

      {codeStatus === 'valid' && isComplete && (
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <p>{t('auth.passwordResetSuccess')}</p>
          <Link to="/login" className="font-semibold underline">
            {t('auth.backToLogin')}
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
