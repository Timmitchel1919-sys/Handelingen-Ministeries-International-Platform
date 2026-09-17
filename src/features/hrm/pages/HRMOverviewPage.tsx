import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Icon } from '@/components/ui/icons';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthContext';

export function HRMOverviewPage() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const sections = [
    {
      id: 'registrations',
      title: t('hrm.registrations.title', { defaultValue: 'Registration Intake' }),
      description: t('hrm.registrations.desc', { defaultValue: 'Review new member applications.' }),
      icon: 'inbox' as const,
      route: '/hrm/registrations',
      permission: 'registrations.manage' as const,
    },
    {
      id: 'members',
      title: t('hrm.members.title', { defaultValue: 'Member Directory' }),
      description: t('hrm.members.desc', { defaultValue: 'View and manage approved members.' }),
      icon: 'members' as const,
      route: '/hrm/members',
      permission: 'members.manage' as const,
    },
    {
      id: 'households',
      title: t('hrm.households.title', { defaultValue: 'Households' }),
      description: t('hrm.households.desc', { defaultValue: 'Group members into families.' }),
      icon: 'users' as const,
      route: '/hrm/households',
      permission: 'households.manage' as const,
    },
    {
      id: 'transfers',
      title: t('hrm.transfers.title', { defaultValue: 'Transfers' }),
      description: t('hrm.transfers.desc', { defaultValue: 'Manage church transfers.' }),
      icon: 'arrow-right' as const,
      route: '/hrm/transfers',
      permission: 'transfers.manage' as const,
    },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('navigation.hrm')}
        description={t('hrm.overview.description', { defaultValue: 'Human Resource & Member Management.' })}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((sec) => {
            if (!hasPermission(sec.permission)) return null;
            return (
              <NavLink key={sec.id} to={sec.route} className="block group">
                <Card className="h-full p-6 transition-all hover:border-[var(--color-primary)] hover:shadow-md">
                  <div className="mb-4 inline-flex rounded-xl bg-[var(--color-primary)]/10 p-3 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    <Icon name={sec.icon as any} size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[var(--color-text)]">
                    {sec.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {sec.description}
                  </p>
                </Card>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
