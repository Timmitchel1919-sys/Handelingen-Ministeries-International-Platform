import { forwardRef, type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/utils/cn';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, label, id, ...props },
  ref,
) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <label htmlFor={switchId} className="inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={switchId}
          className={cn('peer sr-only', className)}
          {...props}
        />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-[var(--color-border)] transition-colors duration-150 peer-checked:bg-[var(--color-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-color)] peer-focus-visible:ring-offset-2"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 h-5 w-5 translate-x-0 rounded-full bg-white shadow-sm transition-transform duration-150 peer-checked:translate-x-5"
        />
      </span>
      {label && <span className="text-sm text-[var(--color-text)]">{label}</span>}
    </label>
  );
});
