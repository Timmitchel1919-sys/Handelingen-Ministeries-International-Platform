import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EventForm, type EventFormData } from '../components/EventForm';
import { eventService } from '@/services/event-service';
import { useAuth } from '@/features/auth/AuthContext';
import { getSelectedChurchId } from '@/services/church-context';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    const churchId = getSelectedChurchId();
    if (!churchId || !user) {
      alert('Missing church context or user session');
      return;
    }
    
    setIsLoading(true);
    try {
      await eventService.createEvent(
        {
          ...data,
          churchId
        },
        user.id
      );
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event', error);
      alert('Failed to create event. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Create New Event" 
        description="Fill in the details to create a new event."
      />
      
      <Card className="max-w-2xl p-6">
        <EventForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/events')}
          isLoading={isLoading}
        />
      </Card>
    </PageContainer>
  );
}
