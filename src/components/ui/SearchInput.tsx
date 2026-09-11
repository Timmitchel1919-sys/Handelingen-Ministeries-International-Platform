import { type InputHTMLAttributes, forwardRef } from 'react';

import { Icon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function SearchInput({ className, ...props }, ref) {
    return (
      <div className="relative">
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          className={cn(
            'h-10 w-full rounded-md border border-[var(--color-border)] bg-surface pl-9 pr-3 text-sm text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
