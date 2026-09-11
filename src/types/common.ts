/** Shared, cross-feature types used by the data-access and UI layers. */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: AppError | null;
}

/** Normalized error shape surfaced by services so the UI never handles raw
 * provider errors (Firebase error codes, network exceptions, ...) directly. */
export interface AppError {
  kind: 'validation' | 'network' | 'auth' | 'authorization' | 'not-found' | 'unknown';
  message: string;
  /** Original provider error code, kept for logging/debugging only. */
  cause?: unknown;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
  total?: number;
}

export interface NavBadge {
  count?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
