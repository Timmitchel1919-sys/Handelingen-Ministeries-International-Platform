import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/features/auth/AuthContext';
import { servingTeamService } from '@/services/serving-team-service';

export function CreateServingTeamPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchId || !user) return;
    
    try {
      setLoading(true);
      const newTeamId = await servingTeamService.createServingTeam(churchId, {
        name,
        description,
        status: 'ACTIVE',
        createdBy: user.id,
        ministryId: null,
        departmentId: null,
        teamLeaderMemberId: null
      });
      navigate(`/serving-teams/${newTeamId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title={t('servingTeams.create')}>
      <PageHeader 
        title={t('servingTeams.create')} 
        showBreadcrumbs
      />

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/serving-teams')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !name}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
