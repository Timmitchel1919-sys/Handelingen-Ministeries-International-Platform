import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface PageContainerProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Standard page wrapper (heading + actions + content) so pages never
 * hand-roll their own header layout. */
export function PageContainer({ title, description, actions, children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto flex w-full max-w-[var(--container-max-width)] flex-col gap-6 p-4 md:p-6', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)] md:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
