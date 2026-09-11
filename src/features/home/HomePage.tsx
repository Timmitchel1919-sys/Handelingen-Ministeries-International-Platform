import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAuth } from '@/features/auth/AuthContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/icons';

/**
 * Public landing page - the entry point of the registration flow
 * (Homepage -> choose church -> registration, see Layer 1 spec section
 * 11). Visually matches the supplied Homepage HTML reference
 * (glassmorphism nav/hero/cards on a navy-to-sky radial gradient), built
 * with Layer 0 tokens/components rather than a second design system.
 */
export function HomePage() {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();
  const { status } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden [background:radial-gradient(circle_at_20%_0%,var(--color-accent)_0%,var(--color-primary)_35%,var(--color-primary-dark)_100%)]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 -top-24 h-[500px] w-[500px] rounded-full bg-secondary/35 blur-[80px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-36 h-[600px] w-[600px] rounded-full bg-[var(--color-primary-dark)]/40 blur-[80px]" />

      <div className="relative z-[1] mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/35 bg-white/15 px-5 py-4 shadow-xl backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <img src={appConfig.logoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="leading-tight">
              <span className="block text-[15px] font-semibold text-white">{t('appName')}</span>
              <span className="block text-[11px] tracking-wide text-white/80">INTERNATIONAL</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            {status === 'authenticated' ? (
              <Link
                to="/dashboard"
                className="rounded-xl border border-white/40 bg-secondary/85 px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
              >
                {t('navigation.dashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-xl border border-white/40 bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-transform hover:-translate-y-0.5"
              >
                {t('auth.signIn')}
              </Link>
            )}
          </div>
        </nav>

        <section className="mb-12 px-4 py-10 text-center text-white">
          <h1 className="mb-3 text-3xl font-bold [text-shadow:0_4px_20px_rgba(0,0,0,0.25)] sm:text-4xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base italic opacity-90">{t('home.heroVerse')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/select-church"
              className="rounded-2xl border border-white/40 bg-gradient-to-br from-secondary/90 to-accent/75 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {t('home.joinUs')}
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-white/40 bg-white/20 px-8 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform hover:-translate-y-0.5"
            >
              {t('auth.signIn')}
            </Link>
          </div>
        </section>

        <div className="mb-8 text-center text-white">
          <h2 className="text-2xl font-bold">{t('home.getConnectedTitle')}</h2>
          <p className="mt-1 text-sm opacity-85">{t('home.getConnectedSubtitle')}</p>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(['sermons', 'missions', 'community'] as const).map((key) => (
            <div
              key={key}
              className="rounded-[20px] border border-white/35 bg-white/15 p-6 text-white shadow-xl backdrop-blur-2xl transition-transform hover:-translate-y-1.5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/25 text-2xl">
                <Icon
                  name={key === 'sermons' ? 'documents' : key === 'missions' ? 'globe' : 'members'}
                  size={26}
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t(`home.cards.${key}.title`)}</h3>
              <p className="text-sm leading-relaxed opacity-90">{t(`home.cards.${key}.description`)}</p>
            </div>
          ))}
        </div>

        <footer className="rounded-2xl border border-white/35 bg-white/15 px-5 py-6 text-center text-[13px] text-white/85 shadow-xl backdrop-blur-2xl">
          {t('appName')} &mdash; {t('home.footerTagline')} &mdash; &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
