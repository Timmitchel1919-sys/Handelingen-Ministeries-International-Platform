import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/layout/PageHeader';

export function TransfersPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('hrm.transfers.title', { defaultValue: 'Transfers' })}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <p>Transfers coming soon...</p>
      </div>
    </div>
  );
}
