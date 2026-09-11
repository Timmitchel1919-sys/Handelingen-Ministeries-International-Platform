import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/features/auth/AuthContext';
import { RegistrationProvider } from '@/features/auth/RegistrationContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';

import '@/i18n';

/** Composes every app-wide provider in one place so `main.tsx` stays a
 * plain render call and provider order is defined exactly once. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RegistrationProvider>{children}</RegistrationProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
