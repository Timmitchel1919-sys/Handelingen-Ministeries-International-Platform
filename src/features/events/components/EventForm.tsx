import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import type { ChurchEvent } from '@/types/event';

export type EventFormData = Omit<ChurchEvent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'deletedBy' | 'churchId'>;

interface EventFormProps {
  defaultValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ defaultValues, onSubmit, onCancel, isLoading }: EventFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'CHURCH_SERVICE',
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      scope: 'GLOBAL',
      startAt: '',
      endAt: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locationType: 'PHYSICAL',
      venueName: '',
      address: '',
      onlineMeetingUrl: '',
      registrationRequired: false,
      capacity: undefined,
      attendanceEnabled: false,
      recurrenceType: 'NONE',
      recurrenceEndDate: '',
      isLiveEnabled: false,
      livestreamUrl: '',
      registeredCount: 0,
      ...defaultValues,
    }
  });

  const locationType = watch('locationType');
  const registrationRequired = watch('registrationRequired');
  const recurrenceType = watch('recurrenceType');
  const isLiveEnabled = watch('isLiveEnabled');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b pb-2">Basic Details</h3>
        <Input 
          label="Title" 
          {...register('title', { required: 'Title is required' })} 
          error={errors.title?.message}
        />
        
        <Textarea 
          label="Description" 
          rows={4}
          {...register('description', { required: 'Description is required' })}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Event Type" 
            options={[
              { label: 'Church Service', value: 'CHURCH_SERVICE' },
              { label: 'Conference', value: 'CONFERENCE' },
              { label: 'Prayer Meeting', value: 'PRAYER_MEETING' },
              { label: 'Bible Study', value: 'BIBLE_STUDY' },
              { label: 'Other', value: 'OTHER' },
            ]}
            {...register('type', { required: 'Type is required' })}
            error={errors.type?.message}
          />
          
          <Select 
            label="Visibility" 
            options={[
              { label: 'Public', value: 'PUBLIC' },
              { label: 'Members Only', value: 'MEMBERS' },
              { label: 'Private', value: 'PRIVATE' },
            ]}
            {...register('visibility', { required: 'Visibility is required' })}
            error={errors.visibility?.message}
          />

          <Select 
            label="Status" 
            options={[
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]}
            {...register('status', { required: 'Status is required' })}
            error={errors.status?.message}
          />
          
          <Select 
            label="Scope" 
            options={[
              { label: 'Global', value: 'GLOBAL' },
              { label: 'Region', value: 'REGION' },
              { label: 'Church', value: 'CHURCH' },
            ]}
            {...register('scope', { required: 'Scope is required' })}
            error={errors.scope?.message}
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b pb-2">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            type="datetime-local" 
            label="Start Time" 
            {...register('startAt', { required: 'Start time is required' })} 
            error={errors.startAt?.message}
          />
          <Input 
            type="datetime-local" 
            label="End Time" 
            {...register('endAt', { required: 'End time is required' })} 
            error={errors.endAt?.message}
          />
          <Select 
            label="Recurrence" 
            options={[
              { label: 'None', value: 'NONE' },
              { label: 'Daily', value: 'DAILY' },
              { label: 'Weekly', value: 'WEEKLY' },
              { label: 'Monthly', value: 'MONTHLY' },
            ]}
            {...register('recurrenceType')}
          />
          {recurrenceType !== 'NONE' && (
            <Input 
              type="date" 
              label="Recurrence End Date" 
              {...register('recurrenceEndDate')} 
            />
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b pb-2">Location</h3>
        <Select 
          label="Location Type" 
          options={[
            { label: 'Physical', value: 'PHYSICAL' },
            { label: 'Online', value: 'ONLINE' },
            { label: 'Hybrid', value: 'HYBRID' },
          ]}
          {...register('locationType')}
        />
        
        {(locationType === 'PHYSICAL' || locationType === 'HYBRID') && (
          <div className="space-y-4">
            <Input 
              label="Venue Name" 
              {...register('venueName')} 
            />
            <Input 
              label="Address" 
              {...register('address')} 
            />
          </div>
        )}

        {(locationType === 'ONLINE' || locationType === 'HYBRID') && (
          <div className="space-y-4">
            <Input 
              label="Online Meeting URL" 
              {...register('onlineMeetingUrl')} 
            />
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-text)] border-b pb-2">Settings</h3>
        
        <div className="space-y-2">
          <Checkbox 
            label="Require Registration" 
            {...register('registrationRequired')}
          />
          {registrationRequired && (
            <div className="pl-6 pt-2">
              <Input 
                type="number"
                label="Capacity (Leave blank for unlimited)" 
                {...register('capacity', { valueAsNumber: true })} 
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Checkbox 
            label="Enable Attendance Tracking" 
            {...register('attendanceEnabled')}
          />
        </div>

        <div className="space-y-2">
          <Checkbox 
            label="Enable Livestream" 
            {...register('isLiveEnabled')}
          />
          {isLiveEnabled && (
            <div className="pl-6 pt-2">
              <Input 
                label="Livestream URL" 
                {...register('livestreamUrl')} 
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Event'}
        </Button>
      </div>
    </form>
  );
}
