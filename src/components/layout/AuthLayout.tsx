import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { appConfig } from '@/app/config/app.config';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/icons';
import { SkyBackground } from '@/components/public/SkyBackground';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}

export function AuthLayout({
  title,
  description,
  children,
  wide = false,
}: AuthLayoutProps) {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();

  return (
    <SkyBackground>
      <div className="min-h-screen px-4 py-5 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label={t('appName')}
            >
              <img
                src={appConfig.logoUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-white/50"
              />

              <span className="hidden sm:block">
                <span className="block text-sm font-bold text-[var(--color-text)]">
                  Handelingen Ministries
                </span>

                <span className="block text-[10px] font-semibold tracking-[0.16em] text-[var(--color-primary)]">
                  INTERNATIONAL
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Dropdown
                align="end"
                trigger={
                  <button
                    type="button"
                    aria-label={t('common.language')}
                    className="flex items-center gap-1.5 rounded-full border border-white/65 bg-surface/30 px-3 py-2 text-xs font-semibold text-[var(--color-text)] shadow-sm backdrop-blur-xl"
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

              <Dropdown
                align="end"
                trigger={
                  <button
                    type="button"
                    aria-label={t('common.theme')}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/65 bg-surface/30 text-[var(--color-text)] shadow-sm backdrop-blur-xl"
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
          </div>

          <div className="flex flex-1 items-center justify-center py-10">
            <section
              className={[
                'w-full',
                wide ? 'max-w-2xl' : 'max-w-120',
              ].join(' ')}
            >
              <div className="rounded-4xl border border-white/65 bg-surface/25 p-6 shadow-[0_20px_60px_rgba(23,59,112,0.16)] backdrop-blur-[18px] sm:p-9">
                <div className="mb-7 text-center">
                  <img
                    src={appConfig.logoUrl}
                    alt=""
                    className="mx-auto mb-5 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white/30"
                  />

                  <h2 className="text-sm font-bold text-[var(--color-primary)]">
                    Handelingen Ministries
                  </h2>

                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                    International
                  </p>

                  <div className="mx-auto my-4 flex max-w-47.5 items-center gap-3">
                    <div className="h-px flex-1 bg-surface/70" />
                    <span className="text-sm text-[#1458B5]">+</span>
                    <div className="h-px flex-1 bg-surface/70" />
                  </div>

                  <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
                    {t('public.landing.tagline')}
                  </p>

                  <h1 className="mt-7 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                    {title}
                  </h1>

                  {description && (
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text)]/70">
                      {description}
                    </p>
                  )}
                </div>

                {children}
              </div>
            </section>
          </div>
        </div>
      </div>
    </SkyBackground>
  );
}
