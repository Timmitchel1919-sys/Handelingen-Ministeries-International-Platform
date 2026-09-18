import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function SchedulingBoardPage() {
  const { t } = useTranslation();
  
  // Dummy state to simulate the board
  const [selectedEvent, setSelectedEvent] = useState<string>('evt-1');
  
  const events = [
    { id: 'evt-1', name: 'Sunday Service - Oct 1' },
    { id: 'evt-2', name: 'Youth Group - Oct 4' },
  ];

  const roles = [
    { id: 'r-1', name: 'Worship Leader', assigned: 'Alice', status: 'ACCEPTED' },
    { id: 'r-2', name: 'Sound Tech', assigned: null, status: 'PENDING' },
    { id: 'r-3', name: 'Usher', assigned: 'Bob', status: 'DECLINED' },
  ];

  return (
    <PageContainer title={t('scheduling.title')} description={t('scheduling.description')}>
      <div className="flex gap-4 mb-6">
        {events.map(evt => (
          <Button
            key={evt.id}
            variant={selectedEvent === evt.id ? 'primary' : 'outline'}
            onClick={() => setSelectedEvent(evt.id)}
          >
            {evt.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map(role => (
          <Card key={role.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex justify-between">
                <span>{role.name}</span>
                {role.assigned ? (
                   <Badge tone={role.status === 'ACCEPTED' ? 'success' : role.status === 'DECLINED' ? 'danger' : 'neutral'}>
                     {role.status}
                   </Badge>
                ) : (
                   <Badge tone="neutral">OPEN</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {role.assigned ? (
                  <p>Assigned to: <strong>{role.assigned}</strong></p>
                ) : (
                  <p className="text-muted-foreground">{t('scheduling.unassigned')}</p>
                )}
              </div>
              <div className="mt-4">
                <Button size="sm" variant={role.assigned ? 'outline' : 'primary'} className="w-full">
                  {role.assigned ? 'Reassign' : t('scheduling.assign')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

