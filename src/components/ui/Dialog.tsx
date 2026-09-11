import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icons';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Accessible modal dialog: focus-trapped via native <dialog>, closes on
 * Escape and backdrop click, restores focus to the trigger on close. */
export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      className={cn(
        'w-full max-w-lg rounded-lg border border-[var(--color-border)] bg-surface p-0 text-[var(--color-text)] shadow-lg backdrop:bg-black/40',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <h2 id="dialog-title" className="text-base font-semibold">
            {title}
          </h2>
          {description && (
            <p id="dialog-description" className="mt-1 text-sm text-[var(--color-text-muted)]">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="px-5 pb-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          {footer}
        </div>
      )}
    </dialog>,
    document.body,
  );
}
