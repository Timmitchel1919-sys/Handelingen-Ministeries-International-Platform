import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ShellIcon } from './ShellIcon';

const routeLabels: Record<string, string> = {
  dashboard: 'navigation.dashboard',
  ministries: 'navigation.ministries',
  departments: 'navigation.departments',
  members: 'navigation.members',
  leaders: 'navigation.leaders',
  events: 'navigation.events',
  documents: 'navigation.documents',
  tasks: 'navigation.tasks',
  reports: 'navigation.reports',
  notifications: 'navigation.notifications',
  settings: 'navigation.settings',
  profile: 'navigation.profile',
};

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();

  const segments = location.pathname
    .split('/')
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={t('navigation.breadcrumbs')}
      className="flex min-w-0 items-center gap-1.5 text-sm"
    >
      <Link
        to="/dashboard"
        className="shrink-0 text-[var(--color-text)]/50 transition hover:text-[var(--color-primary)]"
      >
        {t('navigation.dashboard')}
      </Link>

      {segments
        .filter((segment) => segment !== 'dashboard')
        .map((segment, index, filtered) => {
          const path = `/${segments
            .slice(0, segments.indexOf(segment) + 1)
            .join('/')}`;

          const translationKey = routeLabels[segment];

          return (
            <span
              key={`${segment}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              <ShellIcon
                name="chevron-right"
                width={14}
                height={14}
                className="shrink-0 text-[var(--color-text)]/30"
              />

              {translationKey ? (
                <Link
                  to={path}
                  className={`truncate transition ${
                    index === filtered.length - 1
                      ? 'font-semibold text-[var(--color-text)]'
                      : 'text-[var(--color-text)]/55 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {t(translationKey)}
                </Link>
              ) : (
                <span className="truncate font-semibold text-[var(--color-text)]">
                  {segment}
                </span>
              )}
            </span>
          );
        })}
    </nav>
  );
}
