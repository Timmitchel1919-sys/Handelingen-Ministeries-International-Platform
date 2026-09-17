import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/features/auth/AuthContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface GlobalPublicHeaderProps {
  /** Called when the "Register" button is clicked. When omitted the button
   *  falls back to a plain Link to /select-church (route-based flow). */
  onRegister?: () => void;
}

export function GlobalPublicHeader({ onRegister }: GlobalPublicHeaderProps) {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();
  const { status } = useAuth();
  const location = useLocation();
  const registerBtnRef = useRef<HTMLButtonElement>(null);
  const { isInstallable, installPWA } = usePWAInstall();

  const authenticated = status === 'authenticated';

  const isActive = (path: string) => location.pathname === path;

  return (
    /*
     * Full-viewport-width sticky header.
     * - position: fixed so it stays at the top as the user scrolls.
     * - inset-x-0 + w-full ensures it spans the entire viewport.
     * - z-50 keeps it above page content.
     * - backdrop-blur + semi-transparent bg gives the glass effect.
     * - pt-3 pb-3 with px matches the landing-page horizontal rhythm.
     */
    <header className="fixed inset-x-0 top-0 z-50 w-full px-1 pt-2 pb-3 sm:px-2 lg:px-2">
      <nav
        aria-label={t('public.navigation.home')}
        className="flex min-h-16 items-center justify-between gap-4 rounded-[22px] border border-white/55 bg-surface/20 px-4 shadow-lg backdrop-blur-2xl sm:px-6"
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={t('appName')}
        >
          <img
            src={appConfig.logoUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />

          <span className="hidden leading-tight sm:block w-max">
            <span className="block text-sm font-bold text-[var(--color-text)]">
              Handelingen Ministries
            </span>
            <span className="mt-1.5 flex w-full justify-between text-[10px] font-extrabold text-[#3FA9F5]">
              {"INTERNATIONAL".split('').map((char, i) => <span key={i}>{char}</span>)}
            </span>
          </span>
        </Link>

        {/* Centre nav links (desktop) */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              isActive('/')
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text)]/75 hover:text-[var(--color-primary)]'
            }`}
          >
            {t('public.navigation.home')}
          </Link>

          <a
            href="#features"
            className="text-sm font-medium text-[var(--color-text)]/75 transition hover:text-[var(--color-primary)]"
          >
            {t('public.navigation.community')}
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-[var(--color-text)]/75 transition hover:text-[var(--color-primary)]"
          >
            {t('public.navigation.bible')}
          </a>
        </div>

        {/* Right action cluster */}
        <div className="flex items-center gap-2">
          {/* Language picker */}
          <Dropdown
            align="end"
            trigger={
              <button
                type="button"
                aria-label={t('common.language')}
                className="flex items-center gap-1.5 rounded-full border border-white/60 bg-surface/25 px-3 py-2 text-xs font-semibold text-[var(--color-text)] backdrop-blur-md transition hover:bg-surface/40"
              >
                <Icon name="globe" size={15} />
                {i18n.language.toUpperCase()}
                <Icon name="chevron-down" size={13} />
              </button>
            }
            items={appConfig.supportedLocales.map((locale) => ({
              key: locale,
              label: locale.toUpperCase(),
              onSelect: () => void i18n.changeLanguage(locale),
            }))}
          />

          {/* Theme picker */}
          <Dropdown
            align="end"
            trigger={
              <button
                type="button"
                aria-label={t('common.theme')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-surface/25 text-[var(--color-text)] backdrop-blur-md transition hover:bg-surface/40"
              >
                <Icon
                  name={
                    mode === 'dark'
                      ? 'moon'
                      : mode === 'light'
                        ? 'sun'
                        : 'monitor'
                  }
                  size={17}
                />
              </button>
            }
            items={[
              {
                key: 'light',
                label: t('common.light'),
                onSelect: () => setMode('light'),
              },
              {
                key: 'dark',
                label: t('common.dark'),
                onSelect: () => setMode('dark'),
              },
              {
                key: 'system',
                label: t('common.system'),
                onSelect: () => setMode('system'),
              },
            ]}
          />

          {/* Download App Button (Visible when PWA is installable) */}
          {isInstallable && (
            <button
              onClick={installPWA}
              className="flex items-center gap-2 rounded-full bg-[#1458B8] px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#0f4798] whitespace-nowrap"
            >
              <Icon name="monitor" size={14} />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          {/* Sign In / Dashboard */}
          <Link
            to={authenticated ? '/dashboard' : '/login'}
            className="hidden rounded-xl border border-white/60 bg-surface/35 px-4 py-2 text-sm font-semibold text-[var(--color-text)] backdrop-blur-md transition hover:bg-surface/55 sm:inline-flex"
          >
            {authenticated ? t('navigation.dashboard') : t('auth.signIn')}
          </Link>

          {/* Register button — triggers in-page modal when onRegister is provided */}
          {!authenticated && (
            <>
              {onRegister ? (
                <button
                  ref={registerBtnRef}
                  type="button"
                  id="landing-register-btn"
                  aria-label={t('public.landing.register')}
                  onClick={onRegister}
                  className="hidden rounded-xl bg-[#1458B8] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#0f4798] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FA9F5] sm:inline-flex"
                >
                  {t('public.landing.register')}
                </button>
              ) : (
                <Link
                  to="/select-church"
                  id="landing-register-btn"
                  className="hidden rounded-xl bg-[#1458B8] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#0f4798] sm:inline-flex"
                >
                  {t('public.landing.register')}
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
