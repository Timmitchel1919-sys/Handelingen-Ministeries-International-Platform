
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export function CreateEventPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit event creation
    navigate('/events');
  };

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Create New Event" 
        description="Fill in the details to create a new event."
      />
      
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Title" 
            placeholder="Event Title" 
            required 
          />
          
          <Textarea 
            label="Description" 
            placeholder="Event Description" 
            rows={4}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Event Type" 
              options={[
                { label: 'Church Service', value: 'CHURCH_SERVICE' },
                { label: 'Conference', value: 'CONFERENCE' },
                { label: 'Prayer Meeting', value: 'PRAYER_MEETING' },
                { label: 'Other', value: 'OTHER' },
              ]}
              required
            />
            
            <Select 
              label="Visibility" 
              options={[
                { label: 'Public', value: 'PUBLIC' },
                { label: 'Members Only', value: 'MEMBERS' },
                { label: 'Private', value: 'PRIVATE' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="datetime-local" 
              label="Start Time" 
              required 
            />
            <Input 
              type="datetime-local" 
              label="End Time" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Location Type" 
              options={[
                { label: 'Physical', value: 'PHYSICAL' },
                { label: 'Online', value: 'ONLINE' },
                { label: 'Hybrid', value: 'HYBRID' },
              ]}
              required
            />
            
            <Select 
              label="Scope" 
              options={[
                { label: 'Global', value: 'GLOBAL' },
                { label: 'Region', value: 'REGION' },
                { label: 'Church', value: 'CHURCH' },
              ]}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => navigate('/events')}>
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
