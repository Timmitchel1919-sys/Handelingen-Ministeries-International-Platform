import { type RefObject, useEffect } from 'react';

/** Invokes `handler` when a pointer event happens outside `ref`'s element.
 * Backs the Dropdown component (and any future popover-style UI). */
export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) return;
      handler();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, enabled]);
}
