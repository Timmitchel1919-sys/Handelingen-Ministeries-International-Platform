import { forwardRef, type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, id, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className={cn(
          'h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]',
          className,
        )}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-[var(--color-text)]">
          {label}
        </label>
      )}
    </div>
  );
});
