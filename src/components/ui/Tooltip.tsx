import { type ReactNode, useId, useState } from 'react';

import { cn } from '@/utils/cn';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
}

/** Lightweight tooltip shown on hover/focus, wired for both mouse and
 * keyboard users via aria-describedby. */
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-primary-dark)] px-2 py-1 text-xs text-white shadow-md',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
