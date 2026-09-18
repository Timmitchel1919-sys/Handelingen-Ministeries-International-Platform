import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, type TableColumn } from '@/components/ui/Table';

interface RequestRow {
  id: string;
  role: string;
  member: string;
  status: 'PENDING' | 'DECLINED';
}

export function TeamLeaderDashboardPage() {
  const { t } = useTranslation();
  
  const requests: RequestRow[] = [
    { id: '1', role: 'Camera Operator', member: 'Charlie', status: 'DECLINED' },
    { id: '2', role: 'Greeter', member: 'Dave', status: 'PENDING' }
  ];

  const columns: TableColumn<RequestRow>[] = [
    { key: 'role', header: 'Role', render: (row) => row.role },
    { key: 'member', header: 'Member', render: (row) => row.member },
    { 
      key: 'status', 
      header: 'Status', 
      render: (row) => (
        <Badge tone={row.status === 'DECLINED' ? 'danger' : 'neutral'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: () => <Button size="sm" variant="outline">Find Replacement</Button>
    }
  ];

  return (
    <PageContainer title={t('scheduling.teamLeader')} description={t('scheduling.description')}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Needs Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            rows={requests}
            getRowKey={(row) => row.id}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

