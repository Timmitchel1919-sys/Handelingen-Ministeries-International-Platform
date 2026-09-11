import { type ReactNode, useId, useRef, useState } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/utils/cn';

export interface DropdownItem {
  key: string;
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
}

/** Accessible menu button: opens on click, closes on outside click, Escape,
 * or item selection; exposes aria-expanded/haspopup on the trigger wrapper. */
export function Dropdown({ trigger, items, align = 'end' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute z-20 mt-2 min-w-[180px] rounded-md border border-[var(--color-border)] bg-surface py-1 shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-raised)]',
                item.danger ? 'text-danger' : 'text-[var(--color-text)]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
