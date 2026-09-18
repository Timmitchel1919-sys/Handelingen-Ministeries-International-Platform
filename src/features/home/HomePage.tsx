import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { appConfig } from '@/app/config/app.config';
import { GlobalPublicHeader } from '@/components/public/GlobalPublicHeader';
import { SkyBackground } from '@/components/public/SkyBackground';
import { Icon } from '@/components/ui/icons';

import { CurvedTransition } from './components/CurvedTransition';
import { LandingFeatures } from './components/LandingFeatures';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SkyBackground>
      {/*
       * GlobalPublicHeader is fixed to the top and is ~64px tall.
       * We add pt-28 (≈ header height 64px + 12px top padding * 2 + 4px gap)
       * to the hero section to compensate.
       */}
      <GlobalPublicHeader onRegister={() => navigate('/select-church')} />

      <main>
        {/* Hero section — pt-28 compensates for the fixed header height */}
        <section className="relative mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl items-center justify-center px-4 pt-28 pb-20 sm:px-6 lg:px-8">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <img
              src={appConfig.logoUrl}
              alt={t('appName')}
              className="mx-auto mb-7 h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
            />

            <div className="mx-auto w-full max-w-fit">
              <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-6xl lg:text-7xl break-words whitespace-normal text-wrap-balance">
                Handelingen Ministries
              </h1>
              <div className="mt-4 flex flex-wrap w-full justify-between text-sm font-extrabold uppercase text-[#1458B8] dark:text-[#3FA9F5]">
                {"INTERNATIONAL".split('').map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </div>
            </div>

            <div className="mx-auto my-7 flex max-w-md items-center gap-4">
              <div className="h-px flex-1 bg-surface/75" />
              <span className="text-xl font-light text-[var(--color-primary)]">+</span>
              <div className="h-px flex-1 bg-surface/75" />
            </div>

            <p className="text-xl font-semibold text-primary-dark sm:text-2xl">
              {t('public.landing.tagline')}
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-text/80 sm:text-lg">
              {t('public.landing.description')}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {/*
               * Primary CTA — opens the in-page registration modal.
               * The Get Started link now mirrors the Register button behavior.
               */}
              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  id="hero-register-btn"
                  onClick={() => navigate('/select-church')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-t from-[#1458B8] to-[#3FA9F5] px-8 text-sm font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_10px_28px_rgba(20,88,184,0.28)] transition duration-200 hover:brightness-110 hover:shadow-[0_14px_35px_rgba(20,88,184,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FA9F5]"
                >
                  {t('public.landing.register')}
                  <Icon name="arrow-right" size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <LandingFeatures />

        {/* Diagonal transition back to white */}
        <CurvedTransition />

        {/* Light theme features or footer area */}
        <section className="relative z-10 bg-surface pb-24 pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl border border-white/55 bg-gradient-to-br from-[#1458B8]/5 to-transparent p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
                {t('public.landing.readyToJoin')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--color-text)]/70">
                {t('public.landing.joinDescription')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/select-church')}
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1458B8] px-8 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f4798]"
              >
                {t('public.landing.createAccount')}
              </button>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-border bg-surface py-12">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
            <p className="text-sm text-[var(--color-text)]/60">
              © {new Date().getFullYear()} Handelingen Ministries International.
              All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </SkyBackground>
  );
}
