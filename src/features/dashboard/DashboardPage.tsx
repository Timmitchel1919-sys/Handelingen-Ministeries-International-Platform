import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/icons';
import { navItems } from '@/components/navigation/nav-items';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { eventService } from '@/services/event-service';
import type { ChurchEvent } from '@/types/event';
import { useAuth } from '@/features/auth/AuthContext';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (user?.churchId) {
      eventService.getDashboardUpcomingEvents(user.churchId, 3)
        .then(res => setEvents(res.items))
        .catch(err => console.error(err))
        .finally(() => setLoadingEvents(false));
    }
  }, [user?.churchId]);

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
        
        {loadingEvents ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse bg-surface/50 h-24" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="p-8 text-center text-text-muted">
            No upcoming events.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <Card key={event.id} className="border-l-4 border-l-[#1458B8]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold truncate">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                    <Icon name="events" size={14} />
                    <span>{new Date(event.startAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted truncate">
                    <Icon name="monitor" size={14} />
                    <span className="truncate">{event.locationType === 'ONLINE' ? 'Online' : event.venueName || 'No location'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
