import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/features/auth/AuthContext';
import { servingTeamService } from '@/services/serving-team-service';
import type { ServingTeam } from '@/types/layer11';

export function TeamDetailsPage() {
  const { t } = useTranslation();
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [team, setTeam] = useState<ServingTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!churchId || !teamId) return;
    
    let mounted = true;
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // Fallback or skip if not implemented, using partial for now
        // Assuming getServingTeams is implemented, not getServingTeamById
        const allTeams = await servingTeamService.getServingTeams(churchId);
        const data = allTeams.items.find((t: any) => t.id === teamId) || null;
        if (mounted) setTeam(data as ServingTeam);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load team'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchTeam();
    return () => { mounted = false; };
  }, [churchId, teamId]);

  if (loading) return <PageContainer title={t('servingTeams.title')}><LoadingState /></PageContainer>;
  if (error || !team) return <PageContainer title={t('servingTeams.title')}><ErrorState title={t('common.error')} description={error?.message || 'Not found'} /></PageContainer>;

  return (
    <PageContainer title={team.name}>
      <PageHeader 
        title={team.name} 
        description={team.description}
        showBreadcrumbs
        status={
          <Badge tone={team.status === 'ACTIVE' ? 'success' : 'neutral'}>
            {team.status}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('servingTeams.roles')}</h2>
          <p className="text-sm text-gray-500">Roles will be listed here.</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('servingTeams.members')}</h2>
          <p className="text-sm text-gray-500">Assigned volunteers will be listed here.</p>
        </Card>
      </div>
    </PageContainer>
  );
}
