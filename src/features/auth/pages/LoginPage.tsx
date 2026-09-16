import {
  type FormEvent,
  useState,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Icon } from '@/components/ui/icons';

import type { AuthAppError } from '@/lib/auth-errors';
import { validateEmail } from '@/lib/validation';

import { logAuditEvent } from '@/services/audit-service';

import {
  signInWithEmail,
  signInWithGoogle,
} from '@/services/auth-service';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] =
    useState(false);

  const [fieldErrors, setFieldErrors] =
    useState<{
      email?: string;
      password?: string;
    }>({});

  const [formError, setFormError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const redirectTo =
    (
      location.state as {
        from?: { pathname: string };
      } | null
    )?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setFormError(null);

    const emailResult =
      validateEmail(email);

    const passwordValid =
      Boolean(password);

    setFieldErrors({
      email: emailResult.errorKey,
      password: passwordValid
        ? undefined
        : 'auth.validation.passwordRequired',
    });

    if (
      !emailResult.valid ||
      !passwordValid
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user =
        await signInWithEmail(
          email,
          password,
          rememberMe,
        );

      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-in',
        resource: 'auth',
        resourceId: user.uid,
        churchId: null,
      });


      navigate(
        redirectTo,
        { replace: true },
      );
    } catch (cause) {
      setFormError(
        t(
          (cause as AuthAppError)
            .messageKey,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle =
    async () => {
      setFormError(null);
      setIsGoogleLoading(true);

      try {
        const user =
          await signInWithGoogle(undefined, rememberMe);

        void logAuditEvent({
          actorUid: user.uid,
          actorRole: 'member',
          action: 'sign-in',
          resource: 'auth',
          resourceId: user.uid,
          churchId: null,
        });

        navigate(
          redirectTo,
          { replace: true },
        );
      } catch (cause) {
        setFormError(
          t(
            (cause as AuthAppError)
              .messageKey,
          ),
        );
      } finally {
        setIsGoogleLoading(false);
      }
    };

  return (
    <AuthLayout
      title={t('auth.welcomeBack')}
      description={t(
        'auth.signInDescription',
      )}
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          error={
            fieldErrors.email
              ? t(fieldErrors.email)
              : undefined
          }
          icon={
            <Icon
              name="mail"
              size={18}
            />
          }
        />

        <PasswordInput
          label={t('auth.password')}
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          error={
            fieldErrors.password
              ? t(fieldErrors.password)
              : undefined
          }
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-[var(--color-text)]/75">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked,
                )
              }
              className="h-4 w-4 accent-[#1458B8]"
            />

            {t(
              'auth.rememberMe',
            )}
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            {t(
              'auth.forgotPassword',
            )}
          </Link>
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-2xl border border-[#d9485f]/20 bg-[#d9485f]/10 px-4 py-3 text-sm font-medium text-[#a82d42]"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          {t('auth.signIn')}
          <Icon
            name="arrow-right"
            size={17}
          />
        </Button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-surface/70" />
          <span className="text-xs font-medium text-[var(--color-text)]/55">
            {t('auth.or')}
          </span>
          <div className="h-px flex-1 bg-surface/70" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          isLoading={isGoogleLoading}
          onClick={handleGoogle}
          className="w-full"
        >
          <span className="font-extrabold text-[#4285F4]">
            G
          </span>

          {t(
            'auth.continueWithGoogle',
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-[var(--color-text)]/70">
        {t('auth.noAccount')}{' '}
        <Link
          to="/signup"
          className="font-bold text-[var(--color-primary)] hover:underline"
        >
          {t(
            'auth.createAccount',
          )}
        </Link>
      </p>
    </AuthLayout>
  );
}
