import {
  type ButtonHTMLAttributes,
  forwardRef,
} from 'react';

import { cn } from '@/utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-gradient-to-r from-[#1458B8] to-[#3FA9F5] text-white shadow-md hover:shadow-lg',
  secondary:
    'border-transparent bg-[#3FA9F5] text-white hover:opacity-90',
  outline:
    'border-white/70 bg-surface/20 text-[var(--color-primary)] backdrop-blur-md hover:bg-surface/40',
  ghost:
    'border-transparent bg-transparent text-[var(--color-primary)] hover:bg-surface/25',
  danger:
    'border-transparent bg-[#d9485f] text-white hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold',
        'transition duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FA9F5]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  );
});
