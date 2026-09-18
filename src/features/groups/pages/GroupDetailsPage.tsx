import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/features/auth/AuthContext';
import { groupService } from '@/services/group-service';
import type { Group, GroupMembership } from '@/types/layer11';

export function GroupDetailsPage() {
  const { t } = useTranslation();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!churchId || !groupId) return;
    
    const load = async () => {
      try {
        setLoading(true);
        const [groupData, membersData] = await Promise.all([
          groupService.getGroupById(churchId, groupId),
          groupService.getGroupMembers(churchId, groupId)
        ]);
        setGroup(groupData as Group);
        setMembers(membersData.items as GroupMembership[]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [churchId, groupId]);

  if (loading) {
    return (
      <PageContainer title={t('groups.details.loading', 'Loading Group...')} >
        <LoadingState />
      </PageContainer>
    );
  }

  if (error || !group) {
    return (
      <PageContainer title={t('groups.details.error', 'Error')} >
        <ErrorState title="Error" description={error || 'Group not found'} onRetry={() => navigate('/groups')} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={group.name}
      description={group.description || t('groups.details.noDescription', 'No description provided')}
      actions={
        <>
          <Button variant="ghost" onClick={() => navigate('/groups')}>
            {t('common.back', 'Back')}
          </Button>
          <Button onClick={() => navigate('edit')}>
            {t('groups.details.edit', 'Edit Group')}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">{t('groups.details.overview', 'Overview')}</h2>
          
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.type', 'Type')}</dt>
              <dd className="mt-1">{group.groupType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.status', 'Status')}</dt>
              <dd className="mt-1">
                <Badge tone={group.status === 'ACTIVE' ? 'success' : 'neutral'}>{group.status}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.location', 'Location')}</dt>
              <dd className="mt-1">{group.location || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.schedule', 'Schedule')}</dt>
              <dd className="mt-1">{group.meetingSchedule || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.capacity', 'Capacity')}</dt>
              <dd className="mt-1">
                {group.capacity ? `${members.length} / ${group.capacity}` : members.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-text-muted)]">{t('groups.fields.visibility', 'Visibility')}</dt>
              <dd className="mt-1">{group.visibility}</dd>
            </div>
          </dl>
        </Card>
        
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('groups.details.members', 'Members')} ({members.length})</h2>
            <Button size="sm" variant="ghost">{t('groups.details.addMember', 'Add')}</Button>
          </div>
          
          {members.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              {t('groups.details.noMembers', 'No members yet.')}
            </p>
          ) : (
            <ul className="space-y-3">
              {members.map(member => (
                <li key={member.id} className="flex items-center justify-between text-sm">
                  <span>{member.memberId}</span>
                  <Badge tone="neutral">{member.role}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

