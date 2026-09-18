import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table, type TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';
import { volunteerService } from '@/services/volunteer-service';
import type { VolunteerProfile, VolunteerStatus } from '@/types/layer11';

export function VolunteerDirectoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statusFilter, setStatusFilter] = useState<VolunteerStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (!churchId) return;
    
    let mounted = true;
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const data = await volunteerService.getVolunteersByChurch(churchId);
        if (mounted) setVolunteers(data.items as VolunteerProfile[]);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load volunteers'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchVolunteers();
    return () => { mounted = false; };
  }, [churchId]);

  const filteredVolunteers = statusFilter === 'ALL' 
    ? volunteers 
    : volunteers.filter(v => v.status === statusFilter);

  if (loading) return <PageContainer title={t('volunteers.title')}><LoadingState /></PageContainer>;
  if (error) return <PageContainer title={t('volunteers.title')}><ErrorState title={t('common.error')} description={error.message} /></PageContainer>;

  const columns: TableColumn<VolunteerProfile>[] = [
    {
      key: 'memberId',
      header: 'Member ID',
      render: (volunteer) => <span className="font-medium">{volunteer.memberId}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (volunteer) => (
        <Badge tone={
          volunteer.status === 'ACTIVE' ? 'success' : 
          volunteer.status === 'INTERESTED' ? 'warning' : 'neutral'
        }>
          {volunteer.status}
        </Badge>
      ),
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (volunteer) => <span>{volunteer.skills?.join(', ') || 'None'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (volunteer) => (
        <Button variant="ghost" onClick={() => navigate(`/volunteers/${volunteer.memberId}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title={t('volunteers.title')}>
      <PageHeader 
        title={t('volunteers.title')} 
        description={t('volunteers.directory')}
        actions={
          <div className="w-48">
            <Select
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VolunteerStatus | 'ALL')}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: t('volunteers.status.INTERESTED') || 'Interested', value: 'INTERESTED' },
                { label: t('volunteers.status.PENDING') || 'Pending', value: 'PENDING' },
                { label: t('volunteers.status.ACTIVE') || 'Active', value: 'ACTIVE' },
                { label: t('volunteers.status.PAUSED') || 'Paused', value: 'PAUSED' },
                { label: t('volunteers.status.INACTIVE') || 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </div>
        }
      />

      {filteredVolunteers.length === 0 ? (
        <EmptyState 
          title="No volunteers found" 
          description={statusFilter !== 'ALL' ? 'No volunteers match the selected filter.' : 'No volunteers available.'} 
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table
            columns={columns}
            rows={filteredVolunteers}
            getRowKey={(v) => v.memberId}
          />
        </Card>
      )}
    </PageContainer>
  );
}
