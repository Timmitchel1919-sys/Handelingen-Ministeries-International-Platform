/**
 * RegistrationModal
 *
 * A two-step in-page registration experience that overlays the landing page.
 *
 * Step 1 — Church selection (loaded via church-service, no direct Firestore)
 * Step 2 — Account creation (via auth-service, no direct Firestore)
 *
 * Design: glass card on top of the existing SkyBackground environment.
 * The modal does NOT introduce a competing background.
 *
 * Architecture:
 *   RegistrationModal → church-service.getActiveChurches()
 *   RegistrationModal → auth-service.registerWithEmail / signInWithGoogle
 *   RegistrationModal → audit-service.logAuditEvent
 *   No getDocs / setDoc / addDoc in this file.
 */
import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegistration } from '@/features/auth/RegistrationContext';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Icon } from '@/components/ui/icons';

import { logAuditEvent } from '@/services/audit-service';
import {
  registerWithEmail,
  signInWithGoogle,
} from '@/services/auth-service';
import { getActiveChurches } from '@/services/church-service';

import type { AuthAppError } from '@/lib/auth-errors';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/lib/validation';

import type { Church } from '@/types/church';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'church' | 'account';

type ChurchLoadState = 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// ChurchStep
// ---------------------------------------------------------------------------

interface ChurchStepProps {
  onContinue: (church: Church) => void;
  onClose: () => void;
}

function ChurchStep({ onContinue, onClose }: ChurchStepProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectId = useId();

  const [churches, setChurches] = useState<Church[]>([]);
  const [loadState, setLoadState] = useState<ChurchLoadState>('loading');
  const [selectedId, setSelectedId] = useState('');
  const [touched, setTouched] = useState(false);

  const load = () => {
    setLoadState('loading');
    getActiveChurches()
      .then((result) => {
        setChurches(result);
        setLoadState('success');
      })
      .catch(() => setLoadState('error'));
  };

  useEffect(load, []);

  const selectedChurch = churches.find((c) => c.id === selectedId) ?? null;
  const showError = touched && !selectedId;

  const handleContinue = () => {
    setTouched(true);
    if (!selectedChurch) return;
    onContinue(selectedChurch);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface/30 text-[var(--color-primary)] shadow-sm ring-2 ring-white/50 backdrop-blur">
          <Icon name="ministries" size={26} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {t('public.landing.selectChurchFirst')}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {t('auth.selectChurch.description')}
        </p>
      </div>

      {/* Church selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-[13px] font-semibold text-[var(--color-text)]"
        >
          {t('public.landing.church')}
        </label>

        {loadState === 'loading' && (
          <div className="flex h-12 items-center justify-center rounded-2xl border border-white/60 bg-surface/25 backdrop-blur-md">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1458B8] border-t-transparent" />
          </div>
        )}

        {loadState === 'error' && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#d9485f]/30 bg-[#d9485f]/10 p-4">
            <p className="text-sm text-[#a82d42]">{t('errorState.title')}</p>
            <button
              type="button"
              onClick={load}
              className="text-xs font-semibold text-[var(--color-primary)] underline"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {loadState === 'success' && churches.length === 0 && (
          <div className="rounded-2xl border border-white/60 bg-surface/25 p-5 text-center text-sm text-[var(--color-text-muted)]">
            {t('auth.selectChurch.emptyTitle')}
          </div>
        )}

        {loadState === 'success' && churches.length > 0 && (
          <div className="relative">
            <select
              id={selectId}
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setTouched(true);
              }}
              aria-invalid={showError || undefined}
              aria-describedby={showError ? `${selectId}-error` : undefined}
              className={[
                'h-12 w-full appearance-none rounded-2xl border bg-surface/30 px-4 pr-10 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200',
                'focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20',
                showError ? 'border-[#d9485f]' : 'border-white/70',
              ].join(' ')}
            >
              <option value="" disabled>
                {t('public.landing.selectChurchPlaceholder')}
              </option>
              {churches.map((church) => (
                <option key={church.id} value={church.id}>
                  {church.name}
                  {church.country ? ` — ${church.country}` : ''}
                </option>
              ))}
            </select>

            {/* Custom chevron */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
            >
              <Icon name="chevron-down" size={17} />
            </span>

            {showError && (
              <span
                id={`${selectId}-error`}
                role="alert"
                className="mt-1.5 block text-xs font-medium text-[#d9485f]"
              >
                {t('public.landing.churchRequired')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={loadState !== 'success' || churches.length === 0}
          onClick={handleContinue}
        >
          {t('public.landing.continue')}
          <Icon name="arrow-right" size={17} />
        </Button>

        <button
          type="button"
          onClick={() => { onClose(); navigate('/login'); }}
          className="text-sm font-medium text-[var(--color-text)]/60 transition hover:text-[var(--color-text)]"
        >
          {t('auth.alreadyHaveAccount')}{' '}
          <span
            className="font-bold text-[var(--color-primary)] hover:underline"
          >
            {t('auth.signIn')}
          </span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AccountStep
// ---------------------------------------------------------------------------

interface AccountStepProps {
  church: Church;
  onBack: () => void;
  onClose: () => void;
}

function AccountStep({ church, onBack, onClose }: AccountStepProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordConfirmation(password, confirmPassword);

    const nextErrors: Record<string, string | undefined> = {
      firstName: firstName.trim() ? undefined : 'auth.validation.displayNameRequired',
      lastName: lastName.trim() ? undefined : 'auth.validation.displayNameRequired',
      email: emailResult.errorKey,
      password: passwordResult.errorKey,
      confirmPassword: confirmResult.errorKey,
    };

    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (!termsAccepted) {
      setFormError(t('auth.validation.termsRequired', { defaultValue: t('auth.terms') }));
      return;
    }

    setIsSubmitting(true);
    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const user = await registerWithEmail({
        email,
        password,
        displayName,
        churchId: church.id,
      });

      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-up',
        resource: 'auth',
        resourceId: user.uid,
        churchId: church.id,
      });

      onClose();
      navigate('/verify-email', { replace: true });
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle(church.id);
      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-up',
        resource: 'auth',
        resourceId: user.uid,
        churchId: church.id,
      });
      onClose();
      navigate('/dashboard', { replace: true });
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Church context banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-surface/30 px-4 py-3 backdrop-blur-md">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1458B8]/15 text-[var(--color-primary)]">
          <Icon name="ministries" size={16} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[var(--color-text)]">{church.name}</p>
          {church.country && (
            <p className="truncate text-[11px] text-[var(--color-text-muted)]">{church.country}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="ml-auto text-xs font-semibold text-[var(--color-primary)] transition hover:underline"
        >
          {t('common.edit')}
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {/* Name row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('auth.firstName')}
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={fieldErrors.firstName ? t(fieldErrors.firstName) : undefined}
          />
          <Input
            label={t('auth.lastName')}
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={fieldErrors.lastName ? t(fieldErrors.lastName) : undefined}
          />
        </div>

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email ? t(fieldErrors.email) : undefined}
          icon={<Icon name="mail" size={18} />}
        />

        <PasswordInput
          label={t('auth.password')}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password ? t(fieldErrors.password) : undefined}
        />

        <PasswordInput
          label={t('auth.confirmPassword')}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword ? t(fieldErrors.confirmPassword) : undefined}
        />

        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-text)]/75">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1458B8]"
          />
          <span>{t('auth.terms')}</span>
        </label>

        {formError && (
          <p
            role="alert"
            className="rounded-2xl border border-[#d9485f]/20 bg-[#d9485f]/10 px-4 py-3 text-sm font-medium text-[#a82d42]"
          >
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
          {t('auth.createAccount')}
          <Icon name="arrow-right" size={17} />
        </Button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-surface/70" />
          <span className="text-xs font-medium text-[var(--color-text)]/55">{t('auth.or')}</span>
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
          <span className="font-extrabold text-[#4285F4]">G</span>
          {t('auth.continueWithGoogle')}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text)]/70">
        {t('auth.alreadyHaveAccount')}{' '}
        <button
          type="button"
          onClick={() => { onClose(); navigate('/login'); }}
          className="font-bold text-[var(--color-primary)] hover:underline"
        >
          {t('auth.signIn')}
        </button>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RegistrationModal (shell)
// ---------------------------------------------------------------------------

export function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const { t } = useTranslation();
  const { selectChurch } = useRegistration();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const [step, setStep] = useState<Step>('church');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  // Reset to step 1 whenever the modal opens
  useEffect(() => {
    if (open) {
      setStep('church');
      setSelectedChurch(null);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []);
        const first = elements[0], last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); previousFocus?.focus(); };
  }, [open, onClose]);

  // Focus first focusable element when opening
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [open, step]);

  if (!open) return null;

  const handleChurchContinue = (church: Church) => {
    selectChurch(church);
    setSelectedChurch(church);
    setStep('account');
  };

  const stepLabel =
    step === 'church'
      ? `${t('public.landing.step')} 1 ${t('public.landing.of')} 2 — ${t('public.landing.selectChurchFirst')}`
      : `${t('public.landing.step')} 2 ${t('public.landing.of')} 2 — ${t('public.landing.accountDetails')}`;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop — subtle so the sky background shows through */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B2447]/25 backdrop-blur-sm"
      />

      {/* Glass card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative z-10 w-full overflow-y-auto rounded-[28px]',
          'border border-white/55 bg-surface/30 shadow-2xl backdrop-blur-2xl',
          'max-h-[90vh]',
          step === 'church' ? 'max-w-md' : 'max-w-lg',
        ].join(' ')}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">
              {t('public.landing.registerModalTitle')}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--color-primary)]">{stepLabel}</p>
          </div>

          {/* Step indicator pills */}
          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <span
              className={`h-2 w-6 rounded-full transition-all duration-300 ${
                step === 'church' ? 'bg-[#1458B8]' : 'bg-[#1458B8]/30'
              }`}
            />
            <span
              className={`h-2 w-6 rounded-full transition-all duration-300 ${
                step === 'account' ? 'bg-[#1458B8]' : 'bg-[#1458B8]/30'
              }`}
            />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('public.landing.closeRegistration')}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-surface/30 text-[var(--color-text)]/60 transition hover:bg-surface/50 hover:text-[var(--color-text)]"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 my-3 h-px bg-surface/40" />

        {/* Step content */}
        <div className="px-6 pb-6">
          {step === 'church' && (
            <ChurchStep
              onContinue={handleChurchContinue}
              onClose={onClose}
            />
          )}

          {step === 'account' && selectedChurch && (
            <AccountStep
              church={selectedChurch}
              onBack={() => setStep('church')}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
