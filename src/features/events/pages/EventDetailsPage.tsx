
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock fetching event details
  const event = {
    id: eventId,
    title: 'Sunday Service',
    description: 'Weekly Sunday worship service.',
    type: 'CHURCH_SERVICE',
    status: 'PUBLISHED',
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 7200000).toISOString(),
    locationType: 'PHYSICAL',
  };

  if (!event) {
    return (
      <PageContainer title='Events'>
        <div>Event not found</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title={event.title} 
        description={`Status: ${event.status}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/events/${eventId}/edit`)}>
              Edit
            </Button>
            <Button onClick={() => navigate(`/events/${eventId}/attendance`)}>
              Attendance
            </Button>
          </div>
        }
      />
      
      <Card className="max-w-3xl p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-gray-700">{event.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Type:</span> {event.type}
            </div>
            <div>
              <span className="font-semibold">Location Type:</span> {event.locationType}
            </div>
            <div>
              <span className="font-semibold">Start Time:</span> {new Date(event.startAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">End Time:</span> {new Date(event.endAt).toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
