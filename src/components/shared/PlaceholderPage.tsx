import { useTranslation } from 'react-i18next';

import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import type { IconName } from '@/components/ui/icons';

export interface PlaceholderPageProps {
  titleKey: string;
  icon: IconName;
}

/**
 * Shared shell for navigation destinations whose business functionality is
 * deferred to a later layer (see Master Build Prompt phases). Each
 * feature's page component wraps this with its own title/icon so the
 * route table stays feature-oriented without duplicating this markup.
 */
export function PlaceholderPage({ titleKey, icon }: PlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <PageContainer title={t(titleKey)}>
      <EmptyState icon={icon} title={t('common.comingSoon')} description={t('emptyState.description')} />
    </PageContainer>
  );
}
