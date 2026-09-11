import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyContent?: ReactNode;
}

/** Generic data table. Wrapped in its own overflow-x container so wide
 * tables scroll horizontally without breaking the page layout. */
export function Table<T>({ columns, rows, getRowKey, emptyContent }: TableProps<T>) {
  if (rows.length === 0 && emptyContent) {
    return <>{emptyContent}</>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn('px-4 py-3 text-left font-medium text-[var(--color-text-muted)]', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)]">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 py-3 text-[var(--color-text)]', column.className)}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
