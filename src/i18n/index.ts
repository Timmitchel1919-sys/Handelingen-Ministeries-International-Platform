import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';

import en from './locales/en/common.json';
import nl from './locales/nl/common.json';

/**
 * i18n foundation.
 *
 * Every user-facing string must be added under a translation key here (or in
 * a future feature-scoped namespace) rather than hardcoded in components.
 * Adding a new language means adding a new `locales/<lng>/common.json` and
 * registering it below and in appConfig.supportedLocales - no other change
 * is required.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nl: { common: nl },
      en: { common: en },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: appConfig.defaultLocale,
    supportedLngs: [...appConfig.supportedLocales],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: appConfig.localeStorageKey,
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
