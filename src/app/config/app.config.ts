/** General application configuration. Not environment/secret-dependent. */
export const appConfig = {
  name: 'Handelingen Ministries International',
  shortName: 'Handelingen Ministries',
  defaultLocale: 'nl',
  supportedLocales: ['nl', 'en'] as const,
  themeStorageKey: 'hmi.theme',
  localeStorageKey: 'hmi.locale',
  /** Served from /public */
  logoUrl: '/Logo_Handelingen_Ministries_1757467470641_1_-removebg-preview.png',
} as const;

export type SupportedLocale = (typeof appConfig.supportedLocales)[number];
