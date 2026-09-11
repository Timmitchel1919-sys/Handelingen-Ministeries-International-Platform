import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorState } from '@/components/ui/ErrorState';

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level render-error safety net.
 *
 * Catches errors React's rendering can't recover from and swaps the whole
 * tree for the shared `ErrorState` instead of a blank page/stack trace -
 * part of the "never show raw technical errors" error-handling foundation.
 * Data-fetching errors are handled per-feature via `AsyncState`/`AppError`
 * (see src/types/common.ts), not by this boundary.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen items-center justify-center p-6">
          <ErrorState onRetry={() => this.setState({ error: null })} />
        </div>
      );
    }

    return this.props.children;
  }
}
