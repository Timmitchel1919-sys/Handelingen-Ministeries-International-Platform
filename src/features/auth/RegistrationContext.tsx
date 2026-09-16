import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { validateActiveChurch } from '@/services/church-service';
import { getSelectedChurchId, setSelectedChurchId, clearSelectedChurchId } from '@/services/church-context';
import type { Church } from '@/types/church';


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
  return getSelectedChurchId();
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
  const [storedId] = useState(readStoredChurchId);
  const [isRestoring, setIsRestoring] = useState(Boolean(storedId));
  const selectionVersion = useRef(0);

  useEffect(() => {
    if (!storedId) {
      return;
    }
    let cancelled = false;
    const version = selectionVersion.current;
    validateActiveChurch(storedId)
      .then((church) => {
        if (cancelled || version !== selectionVersion.current) return;
        setSelectedChurch(church);
        if (!church) clearSelectedChurchId();
      })
      .catch(() => { if (!cancelled && version === selectionVersion.current) setSelectedChurch(null); })
      .finally(() => { if (!cancelled) setIsRestoring(false); });
    return () => { cancelled = true; };
  }, [storedId]);

  const value = useMemo<RegistrationContextValue>(
    () => ({
      selectedChurch,
      isRestoring,
      selectChurch: (church) => {
        selectionVersion.current++;
        setSelectedChurch(church);
        setIsRestoring(false);
        setSelectedChurchId(church.id);
      },
      clearSelectedChurch: () => {
        selectionVersion.current++;
        setSelectedChurch(null);
        setIsRestoring(false);
        clearSelectedChurchId();
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
