import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, type TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/features/auth/AuthContext';
import { servingTeamService } from '@/services/serving-team-service';
import type { ServingTeam } from '@/types/layer11';

export function ServingTeamsDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [teams, setTeams] = useState<ServingTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!churchId) return;
    
    let mounted = true;
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await servingTeamService.getServingTeams(churchId);
        if (mounted) setTeams(data.items as ServingTeam[]);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load teams'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchTeams();
    return () => { mounted = false; };
  }, [churchId]);

  if (loading) return <PageContainer title={t('servingTeams.title')}><LoadingState /></PageContainer>;
  if (error) return <PageContainer title={t('servingTeams.title')}><ErrorState title={t('common.error')} description={error.message} /></PageContainer>;

  const columns: TableColumn<ServingTeam>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (team) => <span className="font-medium">{team.name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (team) => (
        <Badge tone={team.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {team.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (team) => (
        <Button variant="ghost" onClick={() => navigate(`/serving-teams/${team.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title={t('servingTeams.title')}>
      <PageHeader 
        title={t('servingTeams.title')} 
        description={t('servingTeams.dashboard')}
        actions={
          <Button onClick={() => navigate('/serving-teams/new')}>
            {t('servingTeams.create')}
          </Button>
        }
      />

      {teams.length === 0 ? (
        <EmptyState 
          title="No serving teams yet" 
          description="Create a serving team to get started." 
          action={
            <Button onClick={() => navigate('/serving-teams/new')}>
              {t('servingTeams.create')}
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table
            columns={columns}
            rows={teams}
            getRowKey={(t) => t.id}
          />
        </Card>
      )}
    </PageContainer>
  );
}
