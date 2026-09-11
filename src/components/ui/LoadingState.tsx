import { useTranslation } from 'react-i18next';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();

  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-text-muted)]">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]"
        aria-hidden="true"
      />
      <span className="text-sm">{label ?? t('common.loading')}</span>
    </div>
  );
}
