import {
  type FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Icon } from '@/components/ui/icons';
import { LoadingState } from '@/components/ui/LoadingState';

import { useRegistration } from '@/features/auth/RegistrationContext';

import type { AuthAppError } from '@/lib/auth-errors';

import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/lib/validation';

import {
  registerWithEmail,
  signInWithGoogle,
} from '@/services/auth-service';

import {
  getActiveChurches,
} from '@/services/church-service';

import { logAuditEvent } from '@/services/audit-service';

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    selectedChurch,
    isRestoring,
  } = useRegistration();

  const [
    firstName,
    setFirstName,
  ] = useState('');

  const [
    lastName,
    setLastName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    termsAccepted,
    setTermsAccepted,
  ] = useState(false);

  const [
    churchStillActive,
    setChurchStillActive,
  ] = useState(true);

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<
    Record<string, string | undefined>
  >({});

  const [
    formError,
    setFormError,
  ] = useState<string | null>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] = useState(false);

  useEffect(() => {
    if (!selectedChurch) return;

    getActiveChurches()
      .then((churches) => {
        setChurchStillActive(
          churches.some(
            (church) =>
              church.id ===
              selectedChurch.id,
          ),
        );
      })
      .catch(() =>
        setChurchStillActive(false),
      );
  }, [selectedChurch]);

  if (isRestoring) {
    return (
      <AuthLayout
        title={t(
          'auth.createAccount',
        )}
      >
        <LoadingState />
      </AuthLayout>
    );
  }

  if (!selectedChurch) {
    return (
      <Navigate
        to="/select-church"
        replace
      />
    );
  }

  const displayName =
    `${firstName.trim()} ${lastName.trim()}`.trim();

  const handleSubmit =
    async (
      event: FormEvent,
    ) => {
      event.preventDefault();

      setFormError(null);

      const emailResult =
        validateEmail(email);

      const passwordResult =
        validatePassword(password);

      const confirmResult =
        validatePasswordConfirmation(
          password,
          confirmPassword,
        );

      const nextErrors: Record<
        string,
        string | undefined
      > = {
        firstName: firstName.trim()
          ? undefined
          : 'auth.validation.firstNameRequired',

        lastName: lastName.trim()
          ? undefined
          : 'auth.validation.lastNameRequired',

        email:
          emailResult.errorKey,

        password:
          passwordResult.errorKey,

        confirmPassword:
          confirmResult.errorKey,
      };

      setFieldErrors(
        nextErrors,
      );

      const hasErrors =
        Object.values(
          nextErrors,
        ).some(Boolean);

      if (hasErrors) {
        return;
      }

      if (!termsAccepted) {
        setFormError(
          t(
            'auth.validation.termsRequired',
          ),
        );

        return;
      }

      if (!churchStillActive) {
        setFormError(
          t(
            'auth.selectChurch.noLongerActive',
          ),
        );

        return;
      }

      setIsSubmitting(true);

      try {
        const user =
          await registerWithEmail({
            email,
            password,
            displayName,
            churchId:
              selectedChurch.id,
          });

        void logAuditEvent({
          actorUid: user.uid,
          actorRole: 'member',
          action: 'sign-up',
          resource: 'auth',
          resourceId: user.uid,
          churchId:
            selectedChurch.id,
        });

        navigate(
          '/verify-email',
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
          await signInWithGoogle(selectedChurch.id);

        void logAuditEvent({
          actorUid: user.uid,
          actorRole: 'member',
          action: 'sign-up',
          resource: 'auth',
          resourceId: user.uid,
          churchId:
            selectedChurch.id,
        });

        navigate(
          '/dashboard',
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
      title={t(
        'auth.createAccount',
      )}
      description={t(
        'auth.register.description',
        {
          church:
            selectedChurch.name,
        },
      )}
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label={t(
              'auth.firstName',
            )}
            autoComplete="given-name"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value,
              )
            }
            error={
              fieldErrors.firstName
                ? t(
                    fieldErrors.firstName,
                  )
                : undefined
            }
          />

          <Input
            label={t(
              'auth.lastName',
            )}
            autoComplete="family-name"
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value,
              )
            }
            error={
              fieldErrors.lastName
                ? t(
                    fieldErrors.lastName,
                  )
                : undefined
            }
          />
        </div>

        <Input
          label={t(
            'auth.email',
          )}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value,
            )
          }
          error={
            fieldErrors.email
              ? t(
                  fieldErrors.email,
                )
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
          label={t(
            'auth.password',
          )}
          autoComplete="new-password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          error={
            fieldErrors.password
              ? t(
                  fieldErrors.password,
                )
              : undefined
          }
        />

        <PasswordInput
          label={t(
            'auth.confirmPassword',
          )}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value,
            )
          }
          error={
            fieldErrors.confirmPassword
              ? t(
                  fieldErrors.confirmPassword,
                )
              : undefined
          }
        />

        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-text)]/75">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) =>
              setTermsAccepted(
                event.target.checked,
              )
            }
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1458B8]"
          />

          <span>
            {t(
              'auth.terms',
            )}
          </span>
        </label>

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
          {t(
            'auth.createAccount',
          )}

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
        {t(
          'auth.alreadyHaveAccount',
        )}{' '}

        <Link
          to="/login"
          className="font-bold text-[var(--color-primary)] hover:underline"
        >
          {t(
            'auth.signIn',
          )}
        </Link>
      </p>
    </AuthLayout>
  );
}
