import { Link } from 'react-router-dom';

import { Icon } from '@/components/ui/icons';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.path && !isLast ? (
                <Link to={item.path} className="hover:text-[var(--color-text)]">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-[var(--color-text)]' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <Icon name="chevron-right" size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
