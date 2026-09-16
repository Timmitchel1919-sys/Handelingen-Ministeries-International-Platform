import {
  forwardRef,
  type InputHTMLAttributes,
  useId,
} from 'react';

import { cn } from '@/utils/cn';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      label,
      error,
      hint,
      icon,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-[var(--color-text)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={
              [hintId, errorId].filter(Boolean).join(' ') || undefined
            }
            className={cn(
              'h-12 w-full rounded-2xl border bg-surface/30 px-4 text-sm text-[var(--color-text)] outline-none backdrop-blur-md',
              'placeholder:text-[var(--color-text)]/45',
              'transition duration-200',
              'focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20',
              icon && 'pl-10',
              error
                ? 'border-[#d9485f]'
                : 'border-white/70',
              className,
            )}
            {...props}
          />
        </div>

        {hint && !error && (
          <span
            id={hintId}
            className="text-xs text-[var(--color-text-muted)]"
          >
            {hint}
          </span>
        )}

        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-xs font-medium text-[var(--color-error-text)]"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);
