import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icons';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

/** Slide-in panel used for mobile navigation and side-panel forms. */
export function Drawer({ open, onClose, title, children, side = 'right', className }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative flex h-full w-[85vw] max-w-xs flex-col bg-surface shadow-lg',
          side === 'right' ? 'ml-auto' : 'mr-auto',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
