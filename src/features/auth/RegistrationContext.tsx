import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { getActiveChurches } from '@/services/church-service';
import type { Church } from '@/types/church';

const STORAGE_KEY = 'hmi.selectedChurchId';

interface RegistrationContextValue {
  /** The church picked in the "choose your church" step. Always a
   * Firestore document ID, never a display name (see Layer 1 rule:
   * selectedChurchId, not selectedChurchName) - the name is kept alongside
   * only for display, and is re-validated (see church-service.ts) before
   * registration is allowed to proceed. */
  selectedChurch: Church | null;
  /** True while rehydrating the selection from sessionStorage after a
   * page refresh (see below) - callers should render a loading state
   * rather than redirecting to /select-church during this window. */
  isRestoring: boolean;
  selectChurch: (church: Church) => void;
  clearSelectedChurch: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | undefined>(undefined);

function readStoredChurchId(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Carries the selected church across the Homepage -> church selection ->
 * registration -> account creation steps of the registration flow.
 *
 * Held in React state for the current tab and mirrored to sessionStorage
 * (ID only, never the name) so a page refresh mid-registration doesn't
 * lose the selection: on mount, a stored ID is re-validated against
 * Firestore (see church-service.ts) before it's trusted again - a
 * sessionStorage value is just as untrusted as any other client input.
 */
export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const storedId = readStoredChurchId();
    if (!storedId) {
      setIsRestoring(false);
      return;
    }

    getActiveChurches()
      .then((churches) => {
        const church = churches?.find((c) => c.id === storedId) ?? null;
        setSelectedChurch(church);
      })
      .catch(() => setSelectedChurch(null))
      .finally(() => setIsRestoring(false));
  }, []);

  const value = useMemo<RegistrationContextValue>(
    () => ({
      selectedChurch,
      isRestoring,
      selectChurch: (church) => {
        setSelectedChurch(church);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, church.id);
        } catch {
          // sessionStorage unavailable (private browsing, etc.) - the
          // in-memory selection above still works for the current tab.
        }
      },
      clearSelectedChurch: () => {
        setSelectedChurch(null);
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* no-op */
        }
      },
    }),
    [selectedChurch, isRestoring],
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration(): RegistrationContextValue {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within a RegistrationProvider');
  return ctx;
}
