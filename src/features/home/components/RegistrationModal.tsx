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
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';

import { logAuditEvent } from '@/services/audit-service';
import {
  registerWithEmail,
  signInWithGoogle,
} from '@/services/auth-service';
import { appConfig } from '@/app/config/app.config';

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

function ChurchStep({ onContinue }: ChurchStepProps) {
  const { t } = useTranslation();
  const selectId = useId();

  const [churches, setChurches] = useState<Church[]>([]);
  const [loadState, setLoadState] = useState<ChurchLoadState>('loading');
  const [selectedId, setSelectedId] = useState('');
  const [touched, setTouched] = useState(false);

  const load = () => {
    setLoadState('loading');
    setTimeout(() => {
      const staticChurches: Church[] = [
        { id: 'bataliweg', name: 'Handelingen Bataliweg', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'wintiwai', name: 'Handelingen Winti Wai', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'sunnypoint', name: 'Handelingen Sunnypoint', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'vredenburg', name: 'Handelingen Vredenburg', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'tamansari', name: 'Handelingen Tamansari', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'nickerie', name: 'Handelingen Nickerie', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'tapuripa', name: 'Handelingen Tapuripa', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'moengo', name: 'Handelingen Moengo', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'bronsweg', name: 'Handelingen Bronsweg', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
        { id: 'belgie', name: 'Handelingen Belgie', status: 'active', country: '', district: '', createdAt: 0, updatedAt: 0 },
      ];
      setChurches(staticChurches);
      setLoadState('success');
    }, 500);
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
      {/* Church selector */}
      <div className="flex flex-col gap-1.5 mt-2">
        <label
          htmlFor={selectId}
          className="text-[13px] font-semibold text-text"
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
              className="text-xs font-semibold text-primary underline"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {loadState === 'success' && churches.length === 0 && (
          <div className="rounded-2xl border border-white/60 bg-surface/25 p-5 text-center text-sm text-text-muted">
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
                'h-12 w-full appearance-none rounded-2xl border bg-surface/30 px-4 pr-10 text-sm text-text outline-none backdrop-blur-md transition duration-200',
                'focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20',
                showError ? 'border-[#d9485f]' : 'border-white/70',
              ].join(' ')}
            >
              <option value="" disabled className="bg-white text-black">
                {t('public.landing.selectChurchPlaceholder')}
              </option>
              {churches.map((church) => (
                <option key={church.id} value={church.id} className="bg-white text-black">
                  {church.name}
                  {church.country ? ` — ${church.country}` : ''}
                </option>
              ))}
            </select>

            {/* Custom chevron */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
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
          className="w-full bg-linear-to-b from-[#3FA9F5] to-[#1458B8] border border-white/20 text-white shadow-[0_10px_28px_rgba(20,88,184,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:from-[#5BC0FF] hover:to-[#0f4798]"
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

function AccountStep({ church, onClose }: AccountStepProps) {
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
  const [emergencyRel1, setEmergencyRel1] = useState('');
  const [emergencyRel2, setEmergencyRel2] = useState('');
  const [ministryInterest, setMinistryInterest] = useState('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCountry(val);
    setDistrict('');
    if (val === 'Suriname') setPhone('+597 ');
    else if (val === 'Netherlands') setPhone('+31 ');
    else setPhone('');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      setFormError(null);
      const user = await signInWithGoogle(church.id);
      void logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-up',
        resource: 'auth',
        resourceId: user.uid,
        churchId: church.id,
      });
      onClose(); // ensure modal closes
    } catch (err: unknown) {
      const e = err as AuthAppError;
      setFormError(t(e.messageKey));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmResult = validatePasswordConfirmation(password, confirmPassword);

    const nextErrors = Object.entries({
      firstName: firstName.trim() ? undefined : 'auth.validation.displayNameRequired',
      lastName: lastName.trim() ? undefined : 'auth.validation.displayNameRequired',
      email: emailResult.errorKey,
      password: passwordResult.errorKey,
      confirmPassword: confirmResult.errorKey,
    }).reduce((acc, [k, v]) => {
      if (v) acc[k] = v;
      return acc;
    }, {} as Record<string, string>);

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!termsAccepted) {
      setFormError(t('auth.validation.termsRequired', { defaultValue: t('auth.terms') }));
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await registerWithEmail({
        email,
        password,
        churchId: church.id,
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        maritalStatus,
        memberType,
        country,
        district,
        phone,
        emergencyContact1: emergency1 ? { firstName: emergency1.split(' ')[0] || '', lastName: emergency1.split(' ').slice(1).join(' '), phone: '', relationship: emergencyRel1 } : null,
        emergencyContact2: emergency2 ? { firstName: emergency2.split(' ')[0] || '', lastName: emergency2.split(' ').slice(1).join(' '), phone: '', relationship: emergencyRel2 } : null,
        ministryInterest,
        howDidYouHear: hearAbout,
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
    <div className="flex flex-col gap-5 pb-12 mt-2">
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
            <label className="text-[13px] font-semibold text-text">Gender</label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-text outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value="" className="bg-white text-black"></option>
                <option value="male" className="bg-white text-black">Male</option>
                <option value="female" className="bg-white text-black">Female</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-text">Country</label>
            <div className="relative">
              <select
                value={country}
                onChange={handleCountryChange}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-text outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value="" className="bg-white text-black">Select Country</option>
                <option value="Suriname" className="bg-white text-black">Suriname</option>
                <option value="Netherlands" className="bg-white text-black">Netherlands</option>
                <option value="Other" className="bg-white text-black">Other</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {country === 'Suriname' || country === 'Netherlands' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-text">District / City</label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-text outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
                >
                  <option value="" className="bg-white text-black"></option>
                  {country === 'Suriname' ? (
                    <>
                      <option value="Paramaribo" className="bg-white text-black">Paramaribo</option>
                      <option value="Wanica" className="bg-white text-black">Wanica</option>
                      <option value="Nickerie" className="bg-white text-black">Nickerie</option>
                      <option value="Commewijne" className="bg-white text-black">Commewijne</option>
                      <option value="Sipaliwini" className="bg-white text-black">Sipaliwini</option>
                      <option value="Para" className="bg-white text-black">Para</option>
                      <option value="Saramacca" className="bg-white text-black">Saramacca</option>
                      <option value="Coronie" className="bg-white text-black">Coronie</option>
                      <option value="Marowijne" className="bg-white text-black">Marowijne</option>
                      <option value="Brokopondo" className="bg-white text-black">Brokopondo</option>
                    </>
                  ) : (
                    <>
                      <option value="Amsterdam" className="bg-white text-black">Amsterdam</option>
                      <option value="Rotterdam" className="bg-white text-black">Rotterdam</option>
                      <option value="The Hague" className="bg-white text-black">The Hague</option>
                      <option value="Utrecht" className="bg-white text-black">Utrecht</option>
                      <option value="Eindhoven" className="bg-white text-black">Eindhoven</option>
                      <option value="Tilburg" className="bg-white text-black">Tilburg</option>
                      <option value="Groningen" className="bg-white text-black">Groningen</option>
                      <option value="Almere" className="bg-white text-black">Almere</option>
                      <option value="Breda" className="bg-white text-black">Breda</option>
                      <option value="Nijmegen" className="bg-white text-black">Nijmegen</option>
                      <option value="Apeldoorn" className="bg-white text-black">Apeldoorn</option>
                      <option value="Haarlem" className="bg-white text-black">Haarlem</option>
                      <option value="Enschede" className="bg-white text-black">Enschede</option>
                      <option value="Arnhem" className="bg-white text-black">Arnhem</option>
                      <option value="Amersfoort" className="bg-white text-black">Amersfoort</option>
                      <option value="Zaanstad" className="bg-white text-black">Zaanstad</option>
                      <option value="'s-Hertogenbosch" className="bg-white text-black">'s-Hertogenbosch</option>
                      <option value="Haarlemmermeer" className="bg-white text-black">Haarlemmermeer</option>
                      <option value="Zwolle" className="bg-white text-black">Zwolle</option>
                      <option value="Zoetermeer" className="bg-white text-black">Zoetermeer</option>
                      <option value="Leiden" className="bg-white text-black">Leiden</option>
                      <option value="Maastricht" className="bg-white text-black">Maastricht</option>
                      <option value="Dordrecht" className="bg-white text-black">Dordrecht</option>
                      <option value="Ede" className="bg-white text-black">Ede</option>
                      <option value="Other" className="bg-white text-black">Other</option>
                    </>
                  )}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
              </div>
            </div>
          ) : (
            <Input
              label="District / City"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-text">Marital Status</label>
            <div className="relative">
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-text outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value="" className="bg-white text-black"></option>
                <option value="single" className="bg-white text-black">Single</option>
                <option value="married" className="bg-white text-black">Married</option>
                <option value="divorced" className="bg-white text-black">Divorced</option>
                <option value="widowed" className="bg-white text-black">Widowed</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"><Icon name="chevron-down" size={17} /></span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-text">Member Type</label>
            <div className="relative">
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-text outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value="" className="bg-white text-black"></option>
                <option value="member" className="bg-white text-black">Member</option>
                <option value="guest" className="bg-white text-black">Guest</option>
                <option value="partner" className="bg-white text-black">Partner</option>
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
            label="Relationship of Emergency Contact 1"
            value={emergencyRel1}
            onChange={(e) => setEmergencyRel1(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Emergency Contact 2"
            value={emergency2}
            onChange={(e) => setEmergency2(e.target.value)}
          />
          <Input
            label="Relationship of Emergency Contact 2"
            value={emergencyRel2}
            onChange={(e) => setEmergencyRel2(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Ministry Interest</label>
            <div className="relative">
              <select
                value={ministryInterest}
                onChange={(e) => setMinistryInterest(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-white/70 bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md transition duration-200 focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20"
              >
                <option value="" className="bg-white text-black"></option>
                <option value="choir" className="bg-white text-black">Choir</option>
                <option value="usher" className="bg-white text-black">Usher</option>
                <option value="media" className="bg-white text-black">Media & Tech</option>
                <option value="youth" className="bg-white text-black">Youth Ministry</option>
                <option value="children" className="bg-white text-black">Children's Ministry</option>
                <option value="evangelism" className="bg-white text-black">Evangelism</option>
                <option value="facility" className="bg-white text-black">Facility</option>
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

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogle}
          isLoading={isGoogleLoading}
          className="w-full"
        >
          <GoogleIcon className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full bg-gradient-to-b from-[#3FA9F5] to-[#1458B8] border border-white/20 text-white shadow-[0_10px_28px_rgba(20,88,184,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:from-[#5BC0FF] hover:to-[#0f4798]">
          Register
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
          '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full',
          step === 'church' ? 'max-w-md' : 'max-w-lg',
        ].join(' ')}
      >
        {/* Modal Logo */}
        <div className="text-center pt-8 pb-2">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface/30 shadow-sm ring-2 ring-white/50 backdrop-blur">
            <img src={appConfig.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
          </div>
        </div>

        {/* Modal header */}
        <div className="relative flex items-center justify-center px-6 pb-2">
          {step === 'account' && (
            <button
              type="button"
              onClick={() => setStep('church')}
              className="absolute left-6 flex h-9 w-9 items-center justify-center text-[var(--color-text)]/60 transition hover:text-[var(--color-text)]"
            >
              <Icon name="chevron-left" size={20} />
            </button>
          )}

          <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">
            {t('public.landing.registerModalTitle')}
          </h2>
        </div>

        {/* Divider - White like glasscard outline */}
        <div className="mx-6 my-3 h-px bg-white/55" />

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
