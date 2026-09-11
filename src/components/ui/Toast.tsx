import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
}

interface ToastRecord extends Required<Omit<ToastInput, 'description'>> {
  id: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneClasses: Record<ToastTone, string> = {
  info: 'border-l-4 border-l-info',
  success: 'border-l-4 border-l-success',
  warning: 'border-l-4 border-l-warning',
  danger: 'border-l-4 border-l-danger',
};

/**
 * App-wide toast/notification surface.
 *
 * Mount `ToastProvider` once near the root; any component calls
 * `useToast().showToast(...)` to surface a transient message - the standard
 * way non-blocking errors and confirmations reach the user (see rule: users
 * should never see raw technical errors).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const showToast = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID();
    const record: ToastRecord = {
      id,
      tone: toast.tone ?? 'info',
      durationMs: toast.durationMs ?? 5000,
      title: toast.title,
      description: toast.description,
    };
    setToasts((prev) => [...prev, record]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, record.durationMs);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto rounded-md border border-[var(--color-border)] bg-surface p-3 shadow-md',
                toneClasses[toast.tone],
              )}
            >
              <p className="text-sm font-medium text-[var(--color-text)]">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{toast.description}</p>
              )}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
