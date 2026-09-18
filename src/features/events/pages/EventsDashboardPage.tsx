import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/features/auth/AuthContext';
import { eventService } from '@/services/event-service';
import type { ChurchEvent, EventStatus, EventType, EventVisibility } from '@/types/event';
import { CalendarView } from '../components/CalendarView';

export function EventsDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;

  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<EventType | 'ALL'>('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<EventVisibility | 'ALL'>('ALL');

  useEffect(() => {
    if (!churchId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    eventService.queryEvents(churchId)
      .then((data) => {
        if (isMounted) {
          setEvents(data.items as ChurchEvent[]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load events:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [churchId]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && e.type !== typeFilter) return false;
      if (visibilityFilter !== 'ALL' && e.visibility !== visibilityFilter) return false;
      return true;
    });
  }, [events, statusFilter, typeFilter, visibilityFilter]);

  return (
    <PageContainer title="Events">
      <PageHeader 
        title="Events" 
        description="Manage church events, services, and activities."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex bg-surface border border-border rounded-md p-1">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                List
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="px-3"
              >
                Calendar
              </Button>
            </div>
            <Button onClick={() => navigate('/events/new')}>
              Create Event
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <Select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Ongoing', value: 'ONGOING' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ]}
        />
        <Select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          options={[
            { label: 'All Types', value: 'ALL' },
            { label: 'Church Service', value: 'CHURCH_SERVICE' },
            { label: 'Special Service', value: 'SPECIAL_SERVICE' },
            { label: 'Prayer Meeting', value: 'PRAYER_MEETING' },
            { label: 'Bible Study', value: 'BIBLE_STUDY' },
            { label: 'Conference', value: 'CONFERENCE' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />
        <Select 
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value as any)}
          options={[
            { label: 'All Visibilities', value: 'ALL' },
            { label: 'Public', value: 'PUBLIC' },
            { label: 'Members', value: 'MEMBERS' },
            { label: 'Church Only', value: 'CHURCH_ONLY' },
            { label: 'Private', value: 'PRIVATE' },
          ]}
        />
      </div>

      {isLoading ? (
        <LoadingState label="Loading events..." />
      ) : filteredEvents.length === 0 ? (
        <Card className="p-8 text-center text-[var(--color-text-muted)]">
          No events found. Adjust filters or create a new event.
        </Card>
      ) : viewMode === 'calendar' ? (
        <CalendarView events={filteredEvents} onEventClick={(event) => navigate(`/events/${event.id}`)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">{event.type.replace('_', ' ')}</p>
              <div className="text-sm text-[var(--color-text-muted)] space-y-1">
                <div>Status: {event.status}</div>
                <div>Visibility: {event.visibility}</div>
                <div>Start: {new Date(event.startAt).toLocaleString()}</div>
                <div>End: {new Date(event.endAt).toLocaleString()}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
