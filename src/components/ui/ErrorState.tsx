import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Presented instead of raw provider/network errors. Services normalize
 * errors into `AppError` (see src/types/common.ts); this component renders
 * the resulting user-facing message. */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger/30 bg-danger/5 py-16 text-center"
    >
      <Icon name="alert-triangle" size={32} className="text-danger" aria-hidden="true" />
      <div>
        <p className="font-medium text-[var(--color-text)]">{title ?? t('errorState.title')}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description ?? t('errorState.description')}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
