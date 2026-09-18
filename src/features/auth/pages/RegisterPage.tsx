import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingState } from '@/components/ui/LoadingState';

import { useRegistration } from '@/features/auth/RegistrationContext';
import { getActiveChurches } from '@/services/church-service';

import { RegistrationWizard } from '../components/registration/RegistrationWizard';

export function RegisterPage() {
  const { t } = useTranslation();
  const { selectedChurch, isRestoring } = useRegistration();
  const [churchStillActive, setChurchStillActive] = useState(true);

  useEffect(() => {
    if (!selectedChurch) return;

    getActiveChurches()
      .then((churches) => {
        setChurchStillActive(churches.some((church) => church.id === selectedChurch.id));
      })
      .catch(() => setChurchStillActive(false));
  }, [selectedChurch]);

  if (isRestoring) {
    return (
      <AuthLayout title={t('auth.createAccount')}>
        <LoadingState />
      </AuthLayout>
    );
  }

  if (!selectedChurch) {
    return <Navigate to="/select-church" replace />;
  }

  if (!churchStillActive) {
    return (
      <AuthLayout title={t('auth.createAccount')}>
        <p className="rounded-2xl border border-[#d9485f]/20 bg-[#d9485f]/10 px-4 py-3 text-sm font-medium text-[#a82d42]">
          {t('auth.selectChurch.noLongerActive')}
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.createAccount')}
      description={t('auth.register.description', { church: selectedChurch.name })}
    >
      <RegistrationWizard churchId={selectedChurch.id} />

      <p className="mt-7 text-center text-sm text-[var(--color-text)]/70">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </AuthLayout>
  );
}
