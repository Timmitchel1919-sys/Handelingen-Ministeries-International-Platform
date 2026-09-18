import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, type TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/features/auth/AuthContext';
import { groupService } from '@/services/group-service';
import type { Group } from '@/types/layer11';

export function GroupsDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const churchId = user?.churchId;
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!churchId) return;
    
    groupService.getGroups(churchId).then((data) => {
      setGroups(data.items as Group[]);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [churchId]);

  const columns: TableColumn<Group>[] = [
    {
      key: 'name',
      header: t('groups.dashboard.name', 'Name'),
      render: (group) => <span className="font-medium">{group.name}</span>
    },
    {
      key: 'type',
      header: t('groups.dashboard.type', 'Type'),
      render: (group) => group.groupType
    },
    {
      key: 'status',
      header: t('groups.dashboard.status', 'Status'),
      render: (group) => (
        <Badge tone={group.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {group.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (group) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(group.id)}>
          {t('common.view', 'View')}
        </Button>
      ),
      className: 'text-right'
    }
  ];

  return (
    <PageContainer
      title={t('groups.dashboard.title', 'Groups')}
      description={t('groups.dashboard.description', 'Manage church groups and ministries')}
      actions={
        <Button onClick={() => navigate('new')}>
          {t('groups.dashboard.newGroup', 'Create Group')}
        </Button>
      }
    >
      {loading ? (
        <LoadingState label={t('groups.loading', 'Loading groups...')} />
      ) : groups.length === 0 ? (
        <EmptyState
          title={t('groups.dashboard.emptyTitle', 'No Groups Found')}
          description={t('groups.dashboard.emptyDescription', 'Get started by creating your first group.')}
          action={
            <Button onClick={() => navigate('new')}>
              {t('groups.dashboard.newGroup', 'Create Group')}
            </Button>
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table 
            columns={columns} 
            rows={groups} 
            getRowKey={(g) => g.id} 
          />
        </Card>
      )}
    </PageContainer>
  );
}

