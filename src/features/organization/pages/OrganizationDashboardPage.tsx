import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/icons';

export function OrganizationDashboardPage() {
  const { t } = useTranslation();
  return (
    <PageContainer
      title={t('organization.title', 'Organization')}
      description={t('organization.overview', 'Manage ministries, departments, and teams within the church.')}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card className="p-6 bg-surface border-border flex items-center space-x-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Icon name="ministries" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('organization.ministries', 'Total Ministries')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-surface border-border flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-full">
            <Icon name="departments" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('organization.departments', 'Departments')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
            <Icon name="users" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('organization.teams', 'Active Teams')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
            <Icon name="leaders" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('organization.leadership', 'Active Leaders')}</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card className="p-8 text-center text-muted-foreground bg-surface border-border">
          <p>No recent organization activity.</p>
        </Card>
      </div>
    </PageContainer>
  );
}
