import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
  icon?: ReactNode;
  status?: ReactNode;
  showBreadcrumbs?: boolean;
};

export function PageHeader({
  title,
  description,
  actions,
  secondaryActions,
  icon,
  status,
  showBreadcrumbs = true,
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mb-8">
      {showBreadcrumbs && (
        <div className="mb-4">
          <Breadcrumbs />
        </div>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {icon && (
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D7E6F7] bg-surface/90 text-[var(--color-primary)] shadow-xs sm:flex">
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
                {title}
              </h1>

              {status}
            </div>

            {description && (
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[var(--color-text)]/60 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>

        {(actions || secondaryActions) && (
          <div
            aria-label={t('navigation.pageActions')}
            className="flex flex-wrap items-center gap-2.5"
          >
            {secondaryActions}
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
