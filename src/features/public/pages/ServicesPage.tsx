import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalPublicHeader } from '@/components/public/GlobalPublicHeader';
import { SkyBackground } from '@/components/public/SkyBackground';
import { PublicEventCard } from '../components/PublicEventCard';
import { eventService } from '@/services/event-service';
import type { ChurchEvent } from '@/types/event';
import { Calendar, Loader2 } from 'lucide-react';

export function ServicesPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const publicEvents = await eventService.getUpcomingPublicEvents();
        setEvents(publicEvents.items as ChurchEvent[]);
      } catch (error) {
        console.error('Failed to load public events', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, []);

  return (
    <SkyBackground>
      <GlobalPublicHeader />
      
      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            {t('public.services.badge', 'Join Our Services')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 tracking-tight">
            {t('public.services.title', 'Worship With Us')}
          </h1>
          <p className="text-lg md:text-xl text-text/75 leading-relaxed">
            {t(
              'public.services.subtitle',
              'Experience uplifting worship, powerful messages, and a welcoming community. Whether you join us in person or online, there is a place for you here.'
            )}
          </p>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-70">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-text/70 font-medium">
                {t('common.loading', 'Loading upcoming services...')}
              </p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <PublicEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface/20 backdrop-blur-sm border border-white/10 rounded-3xl max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-primary/70" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">
                {t('public.services.empty_title', 'No Upcoming Services')}
              </h3>
              <p className="text-text/70 mb-8 max-w-md">
                {t(
                  'public.services.empty_description',
                  'There are currently no public services or events scheduled. Please check back later or contact us for more information.'
                )}
              </p>
              <a
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-text font-medium rounded-xl transition-colors border border-white/10"
              >
                {t('public.navigation.home', 'Return Home')}
              </a>
            </div>
          )}
        </div>
      </main>
    </SkyBackground>
  );
}
