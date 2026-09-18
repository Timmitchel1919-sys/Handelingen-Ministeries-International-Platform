import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/features/auth/AuthContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { cn } from '@/utils/cn';

interface GlobalPublicHeaderProps {
  onRegister?: () => void;
}

export function GlobalPublicHeader({ onRegister }: GlobalPublicHeaderProps) {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();
  const { status } = useAuth();
  const location = useLocation();
  const registerBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isInstallable, installPWA } = usePWAInstall();

  const authenticated = status === 'authenticated';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const navItems = [
    { label: t('public.navigation.home', 'Home'), path: '/' },
    { label: t('public.navigation.services', 'Services'), path: '/services' },
    { label: t('public.navigation.churches', 'Churches'), path: '/churches' },
    { label: t('public.navigation.aboutUs', 'About Us'), path: '/about-us' },
    { label: t('public.navigation.contact', 'Contact'), path: '/contact' },
  ];

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinkClass = (path: string) =>
    cn(
      'text-sm font-medium transition-all duration-200',
      isActive(path)
        ? 'text-primary font-semibold drop-shadow-[0_0_8px_rgba(63,169,245,0.4)]'
        : 'text-text/75 hover:text-primary hover:brightness-110'
    );

  const mobileNavLinkClass = (path: string) =>
    cn(
      'block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors',
      isActive(path)
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-text/80 hover:bg-surface/40 hover:text-primary'
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-1 pt-2 pb-3 sm:px-2 lg:px-2">
      <nav
        aria-label={t('public.navigation.home', 'Home')}
        className="relative flex min-h-16 items-center justify-between gap-2 rounded-[22px] border border-white/55 bg-surface/20 px-3 shadow-lg backdrop-blur-2xl sm:gap-4 sm:px-6"
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          aria-label={t('appName')}
        >
          <img
            src={appConfig.logoUrl}
            alt=""
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover"
          />

          <span className="hidden leading-tight md:block w-max">
            <span className="block text-sm font-bold text-text">
              Handelingen Ministries
            </span>
            <span className="mt-1.5 flex w-full justify-between text-[10px] font-extrabold text-[#3FA9F5] dark:text-white">
              {"INTERNATIONAL".split('').map((char, i) => <span key={i}>{char}</span>)}
            </span>
          </span>
        </Link>

        {/* Centre nav links (desktop) */}
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.path === '/' ? handleHomeClick : undefined}
              className={navLinkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right action cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop Language picker */}
          <div className="hidden lg:block">
            <Dropdown
              align="end"
              trigger={
                <button
                  type="button"
                  aria-label={t('common.language')}
                  className="flex items-center gap-1.5 rounded-full border border-white/60 bg-surface/25 px-3 py-2 text-xs font-semibold text-text backdrop-blur-md transition hover:bg-surface/40"
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
          </div>

          {/* Desktop Theme picker */}
          <div className="hidden lg:block">
            <Dropdown
              align="end"
              trigger={
                <button
                  type="button"
                  aria-label={t('common.theme')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-surface/25 text-text backdrop-blur-md transition hover:bg-surface/40"
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
          </div>

          {/* Download App Button (Visible when PWA is installable) */}
          {isInstallable && (
            <button
              onClick={installPWA}
              className="hidden lg:flex items-center gap-2 rounded-full bg-linear-to-t from-[#1458B8] to-[#3FA9F5] px-3 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_28px_rgba(20,88,184,0.28)] hover:brightness-110 transition whitespace-nowrap"
            >
              <Icon name="monitor" size={14} />
              <span>Download App</span>
            </button>
          )}

          {/* Sign In / Dashboard (Always visible) */}
          <Link
            to={authenticated ? '/dashboard' : '/login'}
            className="rounded-xl border border-white/60 bg-surface/35 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-text backdrop-blur-md transition hover:bg-surface/55 whitespace-nowrap"
          >
            {authenticated ? t('navigation.dashboard', 'Dashboard') : t('auth.signIn', 'Sign In')}
          </Link>

          {/* Register button (Always visible) */}
          {!authenticated && (
            <>
              {onRegister ? (
                <button
                  ref={registerBtnRef}
                  type="button"
                  id="landing-register-btn"
                  aria-label={t('public.landing.register')}
                  onClick={onRegister}
                  className="rounded-xl bg-linear-to-t from-[#1458B8] to-[#3FA9F5] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_28px_rgba(20,88,184,0.28)] hover:brightness-110 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FA9F5] whitespace-nowrap"
                >
                  {t('public.landing.register', 'Register')}
                </button>
              ) : (
                <Link
                  to="/select-church"
                  id="landing-register-btn"
                  className="rounded-xl bg-linear-to-t from-[#1458B8] to-[#3FA9F5] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_28px_rgba(20,88,184,0.28)] hover:brightness-110 transition whitespace-nowrap"
                >
                  {t('public.landing.register', 'Register')}
                </Link>
              )}
            </>
          )}

          {/* Hamburger Menu Toggle (Mobile/Tablet) */}
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-surface/25 text-text backdrop-blur-md transition hover:bg-surface/40"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>

        {/* Mobile/Tablet Menu Panel */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            ref={menuRef}
            className="absolute top-[110%] left-0 right-0 z-50 flex flex-col gap-2 rounded-2xl border border-white/55 bg-surface/90 px-4 py-4 shadow-xl backdrop-blur-2xl lg:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (item.path === '/') handleHomeClick(e);
                  else setIsMenuOpen(false);
                }}
                className={mobileNavLinkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px w-full bg-border/50" />

            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-medium text-text/80">{t('common.language', 'Language')}</span>
              <div className="flex gap-2">
                {appConfig.supportedLocales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => {
                      void i18n.changeLanguage(locale);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors",
                      i18n.language === locale 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-surface/50 border-white/30 text-text hover:bg-surface/80"
                    )}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-4 mt-2">
              <span className="text-sm font-medium text-text/80">{t('common.theme', 'Theme')}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('light'); setIsMenuOpen(false); }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                    mode === 'light' ? "bg-primary/20 border-primary text-primary" : "bg-surface/50 border-white/30 text-text hover:bg-surface/80"
                  )}
                  aria-label="Light theme"
                >
                  <Icon name="sun" size={16} />
                </button>
                <button
                  onClick={() => { setMode('dark'); setIsMenuOpen(false); }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                    mode === 'dark' ? "bg-primary/20 border-primary text-primary" : "bg-surface/50 border-white/30 text-text hover:bg-surface/80"
                  )}
                  aria-label="Dark theme"
                >
                  <Icon name="moon" size={16} />
                </button>
                <button
                  onClick={() => { setMode('system'); setIsMenuOpen(false); }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                    mode === 'system' ? "bg-primary/20 border-primary text-primary" : "bg-surface/50 border-white/30 text-text hover:bg-surface/80"
                  )}
                  aria-label="System theme"
                >
                  <Icon name="monitor" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
