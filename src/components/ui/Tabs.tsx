import { type ReactNode, useId, useState } from 'react';

import { cn } from '@/utils/cn';

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
}

/** Simple ARIA tabs. Panels are mounted lazily on first activation and kept
 * mounted afterwards, so switching tabs doesn't reset their inner state. */
export function Tabs({ items, defaultKey }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultKey ?? items[0]?.key);
  const [visited, setVisited] = useState<Set<string>>(new Set([activeKey ?? '']));
  const baseId = useId();

  const select = (key: string) => {
    setActiveKey(key);
    setVisited((prev) => new Set(prev).add(key));
  };

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-[var(--color-border)]">
        {items.map((item) => {
          const selected = item.key === activeKey;
          return (
            <button
              key={item.key}
              id={`${baseId}-tab-${item.key}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.key)}
              className={cn(
                'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        if (!visited.has(item.key)) return null;
        return (
          <div
            key={item.key}
            id={`${baseId}-panel-${item.key}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${item.key}`}
            hidden={item.key !== activeKey}
            className="pt-4"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
