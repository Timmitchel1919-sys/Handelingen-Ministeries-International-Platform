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
} from '@/services/auth-service';
import { appConfig } from '@/app/config/app.config';
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
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface/30 shadow-sm ring-2 ring-white/50 backdrop-blur">
          <img src={appConfig.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
        </div>
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
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [memberType, setMemberType] = useState('');
  const [hearAbout, setHearAbout] = useState('');
  const [emergency1, setEmergency1] = useState('');
  const [emergency2, setEmergency2] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('');
  const [ministryInterest, setMinistryInterest] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Gender</label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value=""></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. +1 US"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Marital Status</label>
            <div className="relative">
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value=""></option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Member Type</label>
            <div className="relative">
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value=""></option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
                <option value="partner">Partner</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
          <Input
            label="How did you hear about us?"
            value={hearAbout}
            onChange={(e) => setHearAbout(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Emergency Contact 1"
            value={emergency1}
            onChange={(e) => setEmergency1(e.target.value)}
          />
          <Input
            label="Emergency Contact 2"
            value={emergency2}
            onChange={(e) => setEmergency2(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Relationship of Emergency Contact"
            value={emergencyRel}
            onChange={(e) => setEmergencyRel(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Ministry Interest</label>
            <div className="relative">
              <select
                value={ministryInterest}
                onChange={(e) => setMinistryInterest(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value=""></option>
                <option value="choir">Choir</option>
                <option value="usher">Usher</option>
                <option value="media">Media & Tech</option>
                <option value="youth">Youth Ministry</option>
                <option value="children">Children's Ministry</option>
                <option value="evangelism">Evangelism</option>
                <option value="facility">Facility</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
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
          {t('public.landing.continue')}
          <Icon name="arrow-right" size={17} />
        </Button>

      </form>
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
        <div className="relative flex items-center justify-center px-6 pt-6 pb-2">
          {step === 'account' && (
            <button
              type="button"
              onClick={() => setStep('church')}
              className="absolute left-6 flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-surface/30 text-[var(--color-text)]/60 transition hover:bg-surface/50 hover:text-[var(--color-text)]"
            >
              <Icon name="arrow-left" size={17} />
            </button>
          )}

          <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">
            {t('public.landing.registerModalTitle')}
          </h2>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('public.landing.closeRegistration')}
            className="absolute right-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-surface/30 text-[var(--color-text)]/60 transition hover:bg-surface/50 hover:text-[var(--color-text)]"
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
