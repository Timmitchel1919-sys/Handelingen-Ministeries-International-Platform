import { MapPin, Clock, Calendar, Video, ArrowRight, Map } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { ChurchEvent } from '@/types/event';
import { useTranslation } from 'react-i18next';

interface PublicEventCardProps {
  event: ChurchEvent;
}

export function PublicEventCard({ event }: PublicEventCardProps) {
  const { t } = useTranslation();
  
  // Format dates safely
  let dateFormatted = '';
  let timeFormatted = '';
  try {
    const startDate = parseISO(event.startAt);
    dateFormatted = format(startDate, 'EEEE, MMMM d, yyyy');
    timeFormatted = format(startDate, 'h:mm a');
  } catch (error) {
    console.error('Error formatting date', error);
  }

  const isOnline = event.locationType === 'ONLINE' || event.locationType === 'HYBRID';
  const isPhysical = event.locationType === 'PHYSICAL' || event.locationType === 'HYBRID';

  return (
    <div className="flex flex-col h-full bg-surface/30 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-surface/40 group">
      {/* Type badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20 rounded-full backdrop-blur-md shadow-sm">
          {event.type.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Optional image placeholder area */}
      <div className="h-2 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 opacity-70" />

      <div className="p-6 flex-1 flex flex-col relative z-0">
        <h3 className="text-xl font-bold text-text mb-2 pr-20 group-hover:text-primary transition-colors">{event.title}</h3>
        
        <p className="text-text/75 text-sm mb-6 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center text-text/80 text-sm">
            <Calendar className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
            <span className="font-medium">{dateFormatted}</span>
          </div>
          
          <div className="flex items-center text-text/80 text-sm">
            <Clock className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
            <span>{timeFormatted}</span>
          </div>

          {(isPhysical && (event.venueName || event.address)) && (
            <div className="flex items-start text-text/80 text-sm">
              <MapPin className="w-4 h-4 mr-3 mt-0.5 text-primary/70 shrink-0" />
              <span className="line-clamp-1">{event.venueName}{event.address ? `, ${event.address}` : ''}</span>
            </div>
          )}

          {isOnline && (
            <div className="flex items-center text-text/80 text-sm">
              <Video className="w-4 h-4 mr-3 text-primary/70 shrink-0" />
              <span>{t('public.events.online_available', 'Online stream available')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-4 bg-white/5 backdrop-blur-sm flex justify-end gap-3 mt-auto">
        {isPhysical && (event.address || event.venueName) && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(event.address || event.venueName || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10"
          >
            <Map className="w-4 h-4" />
            {t('public.events.directions', 'Directions')}
          </a>
        )}
        
        {isOnline && (
          <a
            href={event.onlineMeetingUrl || event.livestreamUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors shadow-lg shadow-primary/25"
          >
            <Video className="w-4 h-4" />
            {t('public.events.join', 'Join Online')}
          </a>
        )}

        {/* If neither applies, or we want a generic read more */}
        {!isOnline && (!isPhysical || (!event.address && !event.venueName)) && (
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">
            {t('public.events.details', 'Details')}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

