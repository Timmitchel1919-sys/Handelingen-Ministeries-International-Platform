import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EventForm, type EventFormData } from '../components/EventForm';
import { eventService } from '@/services/event-service';
import { useAuth } from '@/features/auth/AuthContext';
import { getSelectedChurchId } from '@/services/church-context';
import type { ChurchEvent } from '@/types/event';

export function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      const churchId = getSelectedChurchId();
      if (!churchId || !eventId) {
        setError('Missing church ID or event ID');
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await eventService.getEventById(churchId, eventId);
        setEvent(data as ChurchEvent);
      } catch (err) {
        console.error(err);
        setError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    }
    
    void loadEvent();
  }, [eventId]);

  const handleSubmit = async (data: EventFormData) => {
    const churchId = getSelectedChurchId();
    if (!churchId || !user || !eventId) {
      alert('Missing context');
      return;
    }
    
    setIsSaving(true);
    try {
      await eventService.updateEvent(churchId, eventId, data, user.id);
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error('Failed to update event', err);
      alert('Failed to update event. See console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Events">
        <LoadingState label="Loading event details..." />
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer title="Events">
        <ErrorState 
          title="Error" 
          description={error || 'Event not found'} 
          onRetry={() => navigate('/events')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Edit Event" 
        description={`Editing event: ${event.title}`}
      />
      
      <Card className="max-w-2xl p-6">
        <EventForm 
          defaultValues={event}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/events/${eventId}`)}
          isLoading={isSaving}
        />
      </Card>
    </PageContainer>
  );
}
