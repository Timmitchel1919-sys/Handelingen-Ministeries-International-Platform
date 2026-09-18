import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, type TableColumn } from '@/components/ui/Table';

interface AssignmentRow {
  id: string;
  event: string;
  role: string;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export function MyServingPage() {
  const { t } = useTranslation();

  const upcomingAssignments: AssignmentRow[] = [
    { id: '1', event: 'Sunday Service', role: 'Worship Leader', date: 'Oct 1, 2026', status: 'ACCEPTED' },
    { id: '2', event: 'Youth Group', role: 'Sound Tech', date: 'Oct 4, 2026', status: 'PENDING' }
  ];

  const columns: TableColumn<AssignmentRow>[] = [
    { key: 'event', header: 'Event', render: (row) => row.event },
    { key: 'date', header: 'Date', render: (row) => row.date },
    { key: 'role', header: 'Role', render: (row) => row.role },
    { 
      key: 'status', 
      header: 'Status', 
      render: (row) => (
        <Badge tone={row.status === 'ACCEPTED' ? 'success' : row.status === 'DECLINED' ? 'danger' : 'neutral'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        row.status === 'PENDING' ? (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="primary">{t('myServing.accept')}</Button>
            <Button size="sm" variant="outline">{t('myServing.decline')}</Button>
          </div>
        ) : null
      )
    }
  ];

  return (
    <PageContainer title={t('myServing.title')} description={t('myServing.description')}>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('myServing.upcoming')}</CardTitle>
          <Button variant="outline" size="sm">{t('myServing.availability')}</Button>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            rows={upcomingAssignments}
            getRowKey={(row) => row.id}
            emptyContent={<p className="p-4 text-center text-[var(--color-text-muted)]">{t('myServing.noAssignments')}</p>}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

