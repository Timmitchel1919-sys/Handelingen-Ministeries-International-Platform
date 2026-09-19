import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/features/auth/AuthContext';
import { eventService } from '@/services/event-service';
import type { ChurchEvent } from '@/types/event';


export function EventDetailsPage() {
  const { t } = useTranslation('common');
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = hasPermission('events.manage') || hasPermission('events.update');

  useEffect(() => {
    if (!eventId || !user?.churchId) return;

    let isMounted = true;
    setIsLoading(true);
    
    eventService.getEventById(user.churchId, eventId)
      .then(data => {
        if (isMounted) {
          setEvent(data as ChurchEvent);
          setIsLoading(false);
        }
      })
      .catch(_err => {
        if (isMounted) {
          setError('Failed to load event details.');
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [eventId, user?.churchId]);

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
        <div className="p-8 text-center text-red-500">{error || 'Event not found'}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Events" >
      <PageHeader 
        title={event.title} 
        actions={
          canManage && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/events/${eventId}/edit`)}>
                Edit
              </Button>
              {event.status !== 'CANCELLED' && (
                <Button variant="outline" className="text-[#a82d42] border-[#a82d42] hover:bg-[#fff1f3]" onClick={() => {
                  // In a real app, this would show a confirmation modal and ask for a reason.
                  // For now we assume the cancel action is handled elsewhere or is a placeholder.
                  console.log('Cancel Event clicked');
                }}>
                  Cancel Event
                </Button>
              )}
              {event.attendanceEnabled && (
                <Button onClick={() => navigate(`/events/${eventId}/attendance`)}>
                  Manage Attendance
                </Button>
              )}
            </div>
          )
        }
      />
      
      <Card className="max-w-3xl p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg border-b border-border pb-2 mb-3">{t('events.details.about', 'About this Event')}</h3>
            <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{event.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.locationType', 'Location Type')}</span>
              <span className="font-medium">{event.locationType}</span>
            </div>
            
            {(event.venueName || event.address) && (
              <div>
                <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.location', 'Location')}</span>
                <span className="font-medium">{event.venueName} {event.address && `(${event.address})`}</span>
              </div>
            )}
            
            {event.onlineMeetingUrl && (
              <div className="col-span-1 md:col-span-2">
                <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.onlineLink', 'Online Meeting Link')}</span>
                <a href={event.onlineMeetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                  {event.onlineMeetingUrl}
                </a>
              </div>
            )}

            <div>
              <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.startTime', 'Start Time')}</span>
              <span className="font-medium">{new Date(event.startAt).toLocaleString()}</span>
            </div>
            
            <div>
              <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.endTime', 'End Time')}</span>
              <span className="font-medium">{new Date(event.endAt).toLocaleString()}</span>
            </div>

            {event.registrationRequired && (
              <>
                <div>
                  <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.capacity', 'Registration Capacity')}</span>
                  <span className="font-medium">{event.capacity || t('events.details.unlimited', 'Unlimited')}</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.registered', 'Registered')}</span>
                  <span className="font-medium">{event.registeredCount || 0}</span>
                </div>
                {event.registrationDeadline && (
                  <div className="col-span-1 md:col-span-2">
                    <span className="text-[var(--color-text-muted)] text-sm block">{t('events.details.deadline', 'Registration Deadline')}</span>
                    <span className="font-medium">{new Date(event.registrationDeadline).toLocaleString()}</span>
                  </div>
                )}
              </>
            )}

            {event.status === 'CANCELLED' && event.cancellationReason && (
              <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-100">
                <span className="font-semibold block mb-1">{t('events.details.cancellationReason', 'Cancellation Reason')}</span>
                <span>{event.cancellationReason}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
