import { forwardRef, type SelectHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icons';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, options, placeholder, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[13px] font-medium text-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'h-10 w-full appearance-none rounded-md border bg-surface px-3 pr-9 text-sm text--text)]',
            'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring-color)]',
            error ? 'border-danger' : 'border-border)]',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted)]"
        />
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});
