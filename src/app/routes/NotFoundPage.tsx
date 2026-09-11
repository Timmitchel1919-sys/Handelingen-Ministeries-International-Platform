import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center p-6">
      <EmptyState
        icon="alert-triangle"
        title="404"
        description={t('errorState.description')}
        action={
          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
          >
            {t('navigation.dashboard')}
          </Link>
        }
      />
    </div>
  );
}
