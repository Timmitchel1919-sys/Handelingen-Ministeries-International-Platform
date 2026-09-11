import { forwardRef, type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, hint, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        className={cn(
          'h-10 rounded-md border bg-surface px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]',
          error ? 'border-danger' : 'border-[var(--color-border)]',
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <span id={hintId} className="text-xs text-[var(--color-text-muted)]">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
});
