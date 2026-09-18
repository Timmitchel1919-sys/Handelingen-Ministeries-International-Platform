import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/features/auth/AuthContext';
import { volunteerService } from '@/services/volunteer-service';
import type { VolunteerProfile, VolunteerStatus } from '@/types/layer11';

export function VolunteerProfilePage() {
  const { t } = useTranslation();
  const { memberId } = useParams<{ memberId: string }>();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!churchId || !memberId) return;
    
    let mounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await volunteerService.getVolunteerProfile(churchId, memberId);
        if (mounted) setProfile(data as VolunteerProfile | null);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchProfile();
    return () => { mounted = false; };
  }, [churchId, memberId]);

  const handleStatusChange = async (newStatus: VolunteerStatus) => {
    if (!churchId || !memberId || !profile) return;
    
    try {
      setUpdating(true);
      await volunteerService.upsertVolunteerProfile(churchId, memberId, { status: newStatus });
      setProfile({ ...profile, status: newStatus });
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = async () => {
    if (!churchId || !memberId || !profile || !user?.id) return;
    
    try {
      setUpdating(true);
      await volunteerService.upsertVolunteerProfile(churchId, memberId, { 
        status: 'ACTIVE',
        approvedBy: user.id,
        approvedAt: Date.now()
      });
      setProfile({ 
        ...profile, 
        status: 'ACTIVE',
        approvedBy: user.id,
        approvedAt: Date.now()
      });
    } catch (err) {
      console.error('Failed to approve volunteer', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <PageContainer title="Volunteer Profile"><LoadingState /></PageContainer>;
  if (error || !profile) return <PageContainer title="Volunteer Profile"><ErrorState title={t('common.error')} description={error?.message || 'Not found'} /></PageContainer>;

  return (
    <PageContainer title={`Volunteer: ${memberId}`}>
      <PageHeader 
        title={`Volunteer Profile: ${memberId}`} 
        description="Manage volunteer details and status"
        showBreadcrumbs
        status={
          <Badge tone={
            profile.status === 'ACTIVE' ? 'success' : 
            profile.status === 'INTERESTED' ? 'warning' : 'neutral'
          }>
            {profile.status}
          </Badge>
        }
        actions={
          profile.status === 'INTERESTED' || profile.status === 'PENDING' ? (
            <Button onClick={handleApprove} disabled={updating}>
              Approve Volunteer
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleStatusChange('PAUSED')} disabled={updating || profile.status === 'PAUSED'}>
                Pause
              </Button>
              <Button variant="outline" onClick={() => handleStatusChange('INACTIVE')} disabled={updating || profile.status === 'INACTIVE'}>
                Deactivate
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Skills & Interests</h2>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? profile.skills.map(skill => (
                <Badge key={skill} tone="neutral">{skill}</Badge>
              )) : <span className="text-sm text-gray-500">No skills listed</span>}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests?.length > 0 ? profile.interests.map(interest => (
                <Badge key={interest} tone="neutral">{interest}</Badge>
              )) : <span className="text-sm text-gray-500">No interests listed</span>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Availability</h2>
          <p className="text-sm">{profile.availability || 'No availability set.'}</p>
          
          {profile.unavailableDates?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Unavailable Dates</h3>
              <ul className="list-disc list-inside text-sm">
                {profile.unavailableDates.map(date => (
                  <li key={date}>{new Date(date).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
