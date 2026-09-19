import { useState, useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  format 
} from 'date-fns';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import type { ChurchEvent } from '@/types/event';
import { Card } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

interface CalendarViewProps {
  events: ChurchEvent[];
  onEventClick?: (event: ChurchEvent) => void;
}

type ViewMode = 'month' | 'week' | 'list';

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const { t } = useTranslation('common');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const days = useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
    // month view
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate, viewMode]);

  const next = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const prev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const today = () => setCurrentDate(new Date());

  const listEvents = useMemo(() => {
    if (viewMode !== 'list') return [];
    return [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events, viewMode]);

  return (
    <div className="flex flex-col gap-4 bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold w-40">
            {viewMode === 'week' ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')}` : format(currentDate, 'MMMM yyyy')}
          </h2>
          {viewMode !== 'list' && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={prev} className="px-2">
                <Icon name="chevron-left" />
              </Button>
              <Button variant="outline" size="sm" onClick={today}>Today</Button>
              <Button variant="ghost" size="sm" onClick={next} className="px-2">
                <Icon name="chevron-right" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex bg-surface border border-border rounded-md p-1">
          <Button
            variant={viewMode === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('month')}
            className="px-3"
          >
            {t('events.views.month', 'Month')}
          </Button>
          <Button
            variant={viewMode === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
            className="px-3"
          >
            {t('events.views.week', 'Week')}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="px-3"
          >
            {t('events.views.list', 'List')}
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="p-4 flex flex-col gap-3">
          {listEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No events found.</div>
          ) : (
            listEvents.map(event => (
              <Card 
                key={event.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center" 
                onClick={() => onEventClick?.(event)}
              >
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="text-sm text-[var(--color-text-muted)] space-x-2">
                    <span>{format(new Date(event.startAt), 'MMM d, yyyy h:mm a')}</span>
                    <span>•</span>
                    <span>{event.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="hidden sm:block text-sm">
                  {event.locationType}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 border-b border-border">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-border gap-px">
              {days.map((day) => {
                const dayEvents = events.filter(e => isSameDay(new Date(e.startAt), day));
                
                return (
                  <div
                    key={day.toISOString()}
                    className={clsx(
                      "p-2 bg-surface min-h-[120px] transition-colors",
                      viewMode === 'month' && !isSameMonth(day, currentDate) && "text-gray-400 bg-gray-50/50"
                    )}
                  >
                    <div className={clsx(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1",
                      isToday(day) && "bg-primary text-white font-medium"
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className="flex flex-col gap-1">
                      {dayEvents.map(event => (
                        <button
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="text-xs p-1 px-2 rounded truncate text-left bg-primary/20 text-primary-900 hover:bg-primary/30 transition-colors w-full"
                          title={event.title}
                        >
                          {format(new Date(event.startAt), 'HH:mm')} {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
