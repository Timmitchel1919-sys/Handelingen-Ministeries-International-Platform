import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/features/auth/AuthContext';
import { groupService } from '@/services/group-service';
import type { GroupType, GroupStatus } from '@/types/layer11';

export function EditGroupPage() {
  const { t } = useTranslation();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [initLoading, setInitLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groupType: 'HOME_GROUP' as GroupType,
    meetingSchedule: '',
    location: '',
    capacity: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    status: 'ACTIVE' as GroupStatus,
  });

  useEffect(() => {
    if (!churchId || !groupId) return;
    
    groupService.getGroupById(churchId, groupId)
      .then(group => {
        setFormData({
          name: group.name,
          description: group.description,
          groupType: group.groupType,
          meetingSchedule: group.meetingSchedule,
          location: group.location,
          capacity: group.capacity?.toString() || '',
          visibility: group.visibility,
          status: group.status,
        });
        setInitLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load group');
        setInitLoading(false);
      });
  }, [churchId, groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchId || !groupId) return;

    setSaving(true);
    try {
      await groupService.updateGroup(churchId, groupId, {
        name: formData.name,
        description: formData.description,
        groupType: formData.groupType,
        meetingSchedule: formData.meetingSchedule,
        location: formData.location,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
        visibility: formData.visibility,
        status: formData.status,
      });
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error(err);
      // Handle error
    } finally {
      setSaving(false);
    }
  };

  const groupTypes = [
    { value: 'BIBLE_STUDY', label: t('groups.types.bibleStudy', 'Bible Study') },
    { value: 'PRAYER', label: t('groups.types.prayer', 'Prayer Group') },
    { value: 'HOME_GROUP', label: t('groups.types.home', 'Home Group') },
    { value: 'YOUTH', label: t('groups.types.youth', 'Youth') },
    { value: 'YOUNG_ADULTS', label: t('groups.types.youngAdults', 'Young Adults') },
    { value: 'MEN', label: t('groups.types.men', 'Men') },
    { value: 'WOMEN', label: t('groups.types.women', 'Women') },
    { value: 'MARRIAGE', label: t('groups.types.marriage', 'Marriage') },
    { value: 'DISCIPLESHIP', label: t('groups.types.discipleship', 'Discipleship') },
    { value: 'LEADERSHIP', label: t('groups.types.leadership', 'Leadership') },
    { value: 'OTHER', label: t('groups.types.other', 'Other') },
  ];

  if (initLoading) {
    return (
      <PageContainer title={t('groups.edit.loading', 'Loading...')} >
        <LoadingState />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title={t('groups.edit.error', 'Error')} >
        <ErrorState title="Error" description={error} onRetry={() => navigate('/groups')} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={t('groups.edit.title', 'Edit Group')}
      description={t('groups.edit.description', 'Update group details.')}
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label={t('groups.fields.name', 'Group Name')} 
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            required 
          />
          
          <Textarea 
            label={t('groups.fields.description', 'Description')}
            value={formData.description}
            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
          />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select 
              label={t('groups.fields.type', 'Group Type')}
              options={groupTypes}
              value={formData.groupType}
              onChange={(e) => setFormData(p => ({ ...p, groupType: e.target.value as GroupType }))}
            />
            
            <Select 
              label={t('groups.fields.status', 'Status')}
              options={[
                { value: 'ACTIVE', label: t('groups.status.active', 'Active') },
                { value: 'INACTIVE', label: t('groups.status.inactive', 'Inactive') },
                { value: 'ARCHIVED', label: t('groups.status.archived', 'Archived') }
              ]}
              value={formData.status}
              onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as GroupStatus }))}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input 
              label={t('groups.fields.location', 'Location')} 
              value={formData.location}
              onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
            />
            
            <Input 
              label={t('groups.fields.schedule', 'Meeting Schedule')}
              placeholder="e.g. Every Tuesday at 7 PM"
              value={formData.meetingSchedule}
              onChange={(e) => setFormData(p => ({ ...p, meetingSchedule: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select 
              label={t('groups.fields.visibility', 'Visibility')}
              options={[
                { value: 'PUBLIC', label: t('groups.visibility.public', 'Public (Visible to all)') },
                { value: 'PRIVATE', label: t('groups.visibility.private', 'Private (Invite only)') }
              ]}
              value={formData.visibility}
              onChange={(e) => setFormData(p => ({ ...p, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' }))}
            />

            <Input 
              label={t('groups.fields.capacity', 'Max Capacity (Optional)')}
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(`/groups/${groupId}`)} disabled={saving}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={saving || !formData.name}>
              {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}

