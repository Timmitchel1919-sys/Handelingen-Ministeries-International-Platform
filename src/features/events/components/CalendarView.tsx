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
  format 
} from 'date-fns';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';
import type { ChurchEvent } from '@/types/event';

interface CalendarViewProps {
  events: ChurchEvent[];
  onEventClick?: (event: ChurchEvent) => void;
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  return (
    <div className="flex flex-col gap-4 bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold w-40">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={today}>Today</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="px-2">
            <Icon name="chevron-left" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="px-2">
            <Icon name="chevron-right" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)] bg-border gap-px">
        {days.map((day) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.startAt), day));
          
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                "p-2 bg-surface min-h-[100px] transition-colors",
                !isSameMonth(day, currentMonth) && "text-gray-400 bg-gray-50/50"
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
  );
}
