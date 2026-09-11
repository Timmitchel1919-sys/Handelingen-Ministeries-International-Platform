import { Icon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] disabled:opacity-40"
      >
        <Icon name="chevron-left" size={16} />
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
          className={cn(
            'h-8 min-w-8 rounded-md px-2 text-sm font-medium',
            pageNumber === page
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]',
          )}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] disabled:opacity-40"
      >
        <Icon name="chevron-right" size={16} />
      </button>
    </nav>
  );
}
