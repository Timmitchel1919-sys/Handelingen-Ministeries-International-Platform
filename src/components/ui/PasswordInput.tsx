import {
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useState,
} from 'react';

import { Icon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(
  {
    label,
    error,
    id,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[13px] font-semibold text-[var(--color-text)]"
      >
        {label}
      </label>

      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
          aria-hidden="true"
        >
          <Icon name="lock" size={18} />
        </span>

        <input
          {...props}
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'h-12 w-full rounded-2xl border bg-surface/30 px-11 pr-12 text-sm text-[var(--color-text)] outline-none backdrop-blur-md',
            'placeholder:text-[var(--color-text)]/45',
            'transition duration-200',
            'focus:border-[#3FA9F5] focus:bg-surface/45 focus:ring-2 focus:ring-[#3FA9F5]/20',
            error
              ? 'border-[#d9485f]'
              : 'border-white/70',
            className,
          )}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-primary)] transition hover:bg-surface/40"
          aria-label={
            visible
              ? 'Hide password'
              : 'Show password'
          }
        >
          <Icon
            name={visible ? 'eye-off' : 'eye'}
            size={18}
          />
        </button>
      </div>

      {error && (
        <span
          role="alert"
          className="text-xs font-medium text-[#d9485f]"
        >
          {error}
        </span>
      )}
    </div>
  );
});
