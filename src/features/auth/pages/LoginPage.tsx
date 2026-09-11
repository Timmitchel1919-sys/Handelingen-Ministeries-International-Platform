import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { AuthAppError } from '@/lib/auth-errors';
import { validateEmail } from '@/lib/validation';
import { logAuditEvent } from '@/services/audit-service';
import { signInWithEmail } from '@/services/auth-service';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const emailResult = validateEmail(email);
    const passwordResult = password ? { valid: true } : { valid: false, errorKey: 'auth.validation.passwordRequired' };
    setFieldErrors({ email: emailResult.errorKey, password: passwordResult.errorKey });
    if (!emailResult.valid || !passwordResult.valid) return;

    setIsSubmitting(true);
    try {
      const user = await signInWithEmail(email, password);
      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-in',
        resource: 'auth',
        resourceId: user.uid,
        churchId: null,
      });
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t('auth.signIn')} description={t('auth.signInDescription')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password && t(fieldErrors.password)}
        />

        {formError && (
          <p role="alert" className="rounded-md bg-white/20 px-3 py-2 text-sm text-white">
            {formError}
          </p>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-white/90 underline">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-1">
          {t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/85">
        {t('auth.noAccount')}{' '}
        <Link to="/select-church" className="font-semibold text-white underline">
          {t('auth.createAccount')}
        </Link>
      </p>
    </AuthLayout>
  );
}
