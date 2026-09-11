import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { AuthAppError } from '@/lib/auth-errors';
import { validateEmail } from '@/lib/validation';
import { sendPasswordReset } from '@/services/auth-service';

export function ForgotPasswordPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const result = validateEmail(email);
    setFieldError(result.errorKey);
    if (!result.valid) return;

    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setIsSent(true);
    } catch (cause) {
      // Firebase's newer email-enumeration-protected projects resolve this
      // call successfully even for an unknown email; if the underlying
      // project doesn't have that protection, show the same success state
      // regardless, so the form doesn't leak which emails have accounts.
      const authError = cause as AuthAppError;
      if (authError.messageKey === 'auth.errors.invalidCredential') {
        setIsSent(true);
      } else {
        setFormError(t(authError.messageKey));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t('auth.forgotPassword')} description={t('auth.forgotPasswordDescription')}>
      {isSent ? (
        <p role="status" className="rounded-md bg-secondary/25 px-3 py-3 text-center text-sm text-white">
          {t('auth.resetEmailSent')}
        </p>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError && t(fieldError)}
          />
          {formError && (
            <p role="alert" className="rounded-md bg-white/20 px-3 py-2 text-sm text-white">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            {t('auth.sendResetLink')}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-white/85">
        <Link to="/login" className="font-semibold text-white underline">
          {t('auth.backToLogin')}
        </Link>
      </p>
    </AuthLayout>
  );
}
