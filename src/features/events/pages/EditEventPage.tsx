
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit event update
    navigate(`/events/${eventId}`);
  };

  return (
    <PageContainer title='Events'>
      <PageHeader 
        title="Edit Event" 
        description={`Editing event ID: ${eventId}`}
      />
      
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Title" 
            defaultValue="Sunday Service"
            required 
          />
          
          <Textarea 
            label="Description" 
            defaultValue="Weekly Sunday worship service."
            rows={4}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Event Type" 
              defaultValue="CHURCH_SERVICE"
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
              defaultValue="PUBLIC"
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
              defaultValue="PHYSICAL"
              options={[
                { label: 'Physical', value: 'PHYSICAL' },
                { label: 'Online', value: 'ONLINE' },
                { label: 'Hybrid', value: 'HYBRID' },
              ]}
              required
            />
            
            <Select 
              label="Scope" 
              defaultValue="GLOBAL"
              options={[
                { label: 'Global', value: 'GLOBAL' },
                { label: 'Region', value: 'REGION' },
                { label: 'Church', value: 'CHURCH' },
              ]}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => navigate(`/events/${eventId}`)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
