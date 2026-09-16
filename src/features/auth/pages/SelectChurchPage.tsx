import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useRegistration } from '@/features/auth/RegistrationContext';
import { getActiveChurches } from '@/services/church-service';
import type { Church } from '@/types/church';
import { Icon } from '@/components/ui/icons';

/**
 * First step of the registration flow (Homepage -> CHOOSE CHURCH -> member
 * registration, see Layer 1 spec section 11). Only active churches are
 * offered, and only the church's Firestore document ID is ever carried
 * forward (see RegistrationContext) - never a client-typed name.
 */
export function SelectChurchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectChurch } = useRegistration();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [churches, setChurches] = useState<Church[]>([]);

  const load = () => {
    setStatus('loading');
    getActiveChurches()
      .then((result) => {
        setChurches(result);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const handleSelect = (church: Church) => {
    selectChurch(church);
    navigate('/register');
  };

  return (
    <AuthLayout title={t('auth.selectChurch.title')} description={t('auth.selectChurch.description')} wide>
      {status === 'loading' && <LoadingState />}

      {status === 'error' && <ErrorState onRetry={load} />}

      {status === 'success' && churches.length === 0 && (
        <EmptyState icon="ministries" title={t('auth.selectChurch.emptyTitle')} description={t('auth.selectChurch.emptyDescription')} />
      )}

      {status === 'success' && churches.length > 0 && (
        <ul className="flex flex-col gap-3">
          {churches.map((church) => (
            <li key={church.id}>
              <button
                type="button"
                onClick={() => handleSelect(church)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/35 bg-surface/10 px-4 py-3.5 text-left text-white transition-colors hover:bg-surface/20"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-surface/20">
                  <Icon name="ministries" size={20} />
                </span>
                <span className="font-medium">{church.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-center text-sm text-white/85">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/login" className="font-semibold text-white underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </AuthLayout>
  );
}
