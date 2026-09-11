import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from '@/components/ui/icons';
import { Dropdown } from '@/components/ui/Dropdown';

export interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Widen the glass card for content-heavy pages (e.g. registration). */
  wide?: boolean;
}

/**
 * Shared shell for every authentication page (login, register, church
 * selection, verify-email, forgot/reset password).
 *
 * Visually matches the supplied Homepage/Member-registration HTML
 * references - radial navy/sky gradient background, floating blurred
 * color orbs, a frosted-glass card - but implemented with Layer 0 design
 * tokens rather than a second, independent color system, so it still
 * follows the app's light/dark theme.
 */
export function AuthLayout({ title, description, children, wide = false }: AuthLayoutProps) {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 py-10 [background:radial-gradient(circle_at_20%_0%,var(--color-accent)_0%,var(--color-primary)_35%,var(--color-primary-dark)_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-secondary/35 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[var(--color-primary-dark)]/50 blur-[80px]"
      />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <Dropdown
          align="end"
          trigger={
            <span className="rounded-full border border-white/35 bg-white/20 p-2 text-white backdrop-blur-md">
              <Icon name="globe" size={18} />
            </span>
          }
          items={appConfig.supportedLocales.map((locale) => ({
            key: locale,
            label: locale.toUpperCase(),
            onSelect: () => void i18n.changeLanguage(locale),
          }))}
        />
        <Dropdown
          align="end"
          trigger={
            <span className="rounded-full border border-white/35 bg-white/20 p-2 text-white backdrop-blur-md">
              <Icon name={mode === 'dark' ? 'moon' : mode === 'light' ? 'sun' : 'monitor'} size={18} />
            </span>
          }
          items={[
            { key: 'light', label: t('common.light'), onSelect: () => setMode('light') },
            { key: 'dark', label: t('common.dark'), onSelect: () => setMode('dark') },
            { key: 'system', label: t('common.system'), onSelect: () => setMode('system') },
          ]}
        />
      </div>

      <div className={`relative z-[1] w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="mb-6 flex flex-col items-center gap-3 text-center text-white">
          <img
            src={appConfig.logoUrl}
            alt=""
            className="h-16 w-16 rounded-full object-cover shadow-lg ring-4 ring-white/15"
          />
          <span className="text-sm font-semibold tracking-wide opacity-90">{t('appName')}</span>
        </div>

        <div className="rounded-2xl border border-white/35 bg-white/15 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {description && <p className="mt-1.5 text-sm text-white/85">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
