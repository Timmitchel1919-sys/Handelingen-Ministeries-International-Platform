import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { appConfig } from '@/app/config/app.config';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(appConfig.themeStorageKey);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch { return 'system'; }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => root.setAttribute('data-theme', mode === 'system' ? (media.matches ? 'dark' : 'light') : mode);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [mode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    try {
    if (next === 'system') {
      window.localStorage.removeItem(appConfig.themeStorageKey);
    } else {
      window.localStorage.setItem(appConfig.themeStorageKey, next);
    }
    } catch { /* In-memory theme still works when storage is unavailable. */ }
  };

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
