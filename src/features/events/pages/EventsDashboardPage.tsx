
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import type { ChurchEvent } from '@/types/event';

export function EventsDashboardPage() {
  const navigate = useNavigate();

  // Mock data for now
  const events: ChurchEvent[] = [];

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Events" 
        description="Manage church events, services, and activities."
        actions={
          <Button onClick={() => navigate('/events/new')}>
            Create Event
          </Button>
        }
      />

      <div className="flex gap-4 mb-6">
        <Select 
          placeholder="Filter by Status" 
          options={[
            { label: 'All', value: 'ALL' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Completed', value: 'COMPLETED' },
          ]}
        />
        <Select 
          placeholder="Filter by Scope" 
          options={[
            { label: 'All', value: 'ALL' },
            { label: 'Global', value: 'GLOBAL' },
            { label: 'Region', value: 'REGION' },
            { label: 'Church', value: 'CHURCH' },
          ]}
        />
      </div>

      {events.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No events found. Create one to get started.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{event.type}</p>
              <div className="text-sm">
                <div>Status: {event.status}</div>
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
