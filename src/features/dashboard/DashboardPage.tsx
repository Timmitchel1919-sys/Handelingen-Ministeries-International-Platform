import { useTranslation } from 'react-i18next';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/icons';
import { navItems } from '@/components/navigation/nav-items';

/**
 * Dashboard landing page. At Layer 0 this demonstrates the app shell,
 * design tokens and card grid with links into every navigation
 * destination; real metrics/widgets are built out in later layers.
 */
export function DashboardPage() {
  const { t } = useTranslation();
  const overviewItems = navItems.filter((item) => item.key !== 'dashboard');

  return (
    <PageContainer title={t('navigation.dashboard')} description={t('appName')}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {overviewItems.map((item) => (
          <Card key={item.key} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon name={item.icon as IconName} size={18} className="text-[var(--color-primary)]" />
                {t(item.labelKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-muted)]">{t('common.comingSoon')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
