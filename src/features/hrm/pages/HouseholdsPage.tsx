import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/layout/PageHeader';

export function HouseholdsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('hrm.households.title', { defaultValue: 'Households' })}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <p>Households coming soon...</p>
      </div>
    </div>
  );
}
