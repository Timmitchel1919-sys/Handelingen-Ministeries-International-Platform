import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/icons';
import { navItems } from '@/components/navigation/nav-items';
import { Button } from '@/components/ui/Button';

export function DashboardPage() {
  const { t } = useTranslation();
  const overviewItems = navItems.filter((item) => item.key !== 'dashboard');

  return (
    <PageContainer title={t('navigation.dashboard')} description={t('appName')}>
      {/* Upcoming Events Widget */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">Upcoming Events</h2>
          <Link to="/events">
            <Button variant="ghost" size="sm" type="button" className="text-primary">
            View All
          </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-[#1458B8]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Sunday Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Icon name="events" size={14} />
                <span>Next Sunday, 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Icon name="monitor" size={14} />
                <span>Main Auditorium</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#3FA9F5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Prayer Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Icon name="events" size={14} />
                <span>Wednesday, 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Icon name="monitor" size={14} />
                <span>Online (Zoom)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {overviewItems.map((item) => (
          <Card key={item.key} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon name={item.icon as IconName} size={18} className="text-primary" />
                {t(item.labelKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">{t('common.comingSoon')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
