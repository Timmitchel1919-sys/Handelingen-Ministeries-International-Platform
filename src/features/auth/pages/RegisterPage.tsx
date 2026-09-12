import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import type { AuthAppError } from '@/lib/auth-errors';
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/lib/validation';
import { useRegistration } from '@/features/auth/RegistrationContext';
import { logAuditEvent } from '@/services/audit-service';
import { registerWithEmail } from '@/services/auth-service';
import { getActiveChurches } from '@/services/church-service';

/**
 * Account-creation step of the registration flow (see Layer 1 spec
 * section 11: VISITOR -> CHOOSE CHURCH -> MEMBER REGISTRATION -> PERSONAL
 * INFORMATION -> CREATE ACCOUNT -> EMAIL VERIFICATION -> ...).
 *
 * Only the fields needed to create the Firebase Authentication account and
 * the minimal Firestore profile are collected here. The full member-intake
 * form shown in the Member Registration HTML reference (identity, contact,
 * background, emergency contact, ministry interest) belongs to the HRM
 * registration-record step later in that flow and is deliberately NOT
 * implemented in this layer.
 */
export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedChurch, isRestoring } = useRegistration();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [churchStillActive, setChurchStillActive] = useState(true);

  // Defensive re-validation: even though SelectChurchPage only offered
  // active churches, re-confirm against Firestore right before the
  // account is created, in case status changed in between.
  useEffect(() => {
    if (!selectedChurch) return;
    getActiveChurches()
      .then((churches) => {
        const found = churches.some((c: any) => c.id === selectedChurch.id);
        setChurchStillActive(found);
      })
      .catch(() => setChurchStillActive(false));
  }, [selectedChurch]);

  if (isRestoring) {
    return (
      <AuthLayout title={t('auth.register.title')}>
        <LoadingState />
      </AuthLayout>
    );
  }

  if (!selectedChurch) {
    return <Navigate to="/select-church" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const nameResult = validateDisplayName(displayName);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordConfirmation(password, confirmPassword);
    setFieldErrors({
      displayName: nameResult.errorKey,
      email: emailResult.errorKey,
      password: passwordResult.errorKey,
      confirmPassword: confirmResult.errorKey,
    });
    if (!nameResult.valid || !emailResult.valid || !passwordResult.valid || !confirmResult.valid) return;

    if (!churchStillActive) {
      setFormError(t('auth.selectChurch.noLongerActive'));
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerWithEmail({
        email,
        password,
        displayName: displayName.trim(),
        churchId: selectedChurch.id,
      });
      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-up',
        resource: 'auth',
        resourceId: user.uid,
        churchId: selectedChurch.id,
      });
      navigate('/verify-email', { replace: true });
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.register.title')}
      description={t('auth.register.description', { church: selectedChurch.name })}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={t('auth.displayName')}
          autoComplete="name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          error={fieldErrors.displayName && t(fieldErrors.displayName)}
        />
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email && t(fieldErrors.email)}
        />
        <Input
          label={t('auth.password')}
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

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-1">
          {t('auth.createAccount')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/85">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/login" className="font-semibold text-white underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </AuthLayout>
  );
}
