import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { GlobalPublicHeader } from '@/components/public/GlobalPublicHeader';
import { SkyBackground } from '@/components/public/SkyBackground';
import { Icon } from '@/components/ui/icons';

import { CurvedTransition } from './components/CurvedTransition';
import { LandingFeatures } from './components/LandingFeatures';
import { RegistrationModal } from './components/RegistrationModal';

export function HomePage() {
  const { t } = useTranslation();
  const [registrationOpen, setRegistrationOpen] = useState(false);

  return (
    <SkyBackground>
      {/*
       * The header is now position:fixed so we do NOT render it inside the
       * normal flow. It is rendered outside SkyBackground's z-10 wrapper so
       * the fixed positioning is not clipped by a transform ancestor.
       * We add pt-28 (≈ header height 64px + 12px top padding × 2 + 4px gap)
       * to the hero section to compensate.
       */}
      <GlobalPublicHeader onRegister={() => setRegistrationOpen(true)} />

      <main>
        {/* Hero section — pt-28 compensates for the fixed header height */}
        <section className="relative mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl items-center justify-center px-4 pt-28 pb-20 sm:px-6 lg:px-8">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <img
              src={appConfig.logoUrl}
              alt={t('appName')}
              className="mx-auto mb-7 h-24 w-24 rounded-full object-cover shadow-[0_15px_45px_rgba(23,59,112,0.18)] ring-4 ring-white/40 sm:h-28 sm:w-28"
            />

            <div className="mx-auto w-max">
              <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl">
                Handelingen Ministries
              </h1>
              <div className="mt-2 flex w-full justify-between text-sm font-bold uppercase text-[var(--color-primary)]">
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

            <p className="text-xl font-semibold text-[var(--color-primary-dark)] sm:text-2xl">
              {t('public.landing.tagline')}
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--color-text)]/80 sm:text-lg">
              {t('public.landing.description')}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {/*
               * Primary CTA — opens the in-page registration modal.
               * The Get Started link now mirrors the Register button behavior.
               */}
              <button
                type="button"
                id="hero-register-btn"
                onClick={() => setRegistrationOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1458B8] hover:bg-[#0f4798] px-8 text-sm font-bold text-white shadow-[0_10px_28px_rgba(20,88,184,0.28)] transition duration-200 hover:shadow-[0_14px_35px_rgba(20,88,184,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FA9F5]"
              >
                {t('public.landing.register')}
                <Icon name="arrow-right" size={17} />
              </button>

              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/70 bg-surface/30 px-8 text-sm font-bold text-[var(--color-primary)] shadow-sm backdrop-blur-xl transition duration-200 hover:bg-surface/50"
              >
                {t('public.landing.learnMore')}
              </a>
            </div>
          </div>
        </section>

        <CurvedTransition />

        <LandingFeatures />

        <footer className="bg-[#dff2ff] px-4 pb-8 text-center sm:px-6">
          <div className="mx-auto max-w-7xl border-t border-[#1458B8]/10 pt-7 text-sm text-[var(--color-text-muted)]">
            {t('appName')} — {t('public.landing.tagline')} — ©{' '}
            {new Date().getFullYear()}
          </div>
        </footer>
      </main>

      {/* In-page registration modal */}
      <RegistrationModal
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
    </SkyBackground>
  );
}
