import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, type IconName } from '@/components/ui/icons';

export interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] py-16 text-center">
      <Icon name={icon} size={32} className="text-[var(--color-text-muted)]" aria-hidden="true" />
      <div>
        <p className="font-medium text-[var(--color-text)]">{title ?? t('emptyState.title')}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description ?? t('emptyState.description')}</p>
      </div>
      {action}
    </div>
  );
}
