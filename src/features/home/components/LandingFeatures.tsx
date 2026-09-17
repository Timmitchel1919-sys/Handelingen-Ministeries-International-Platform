import { useTranslation } from 'react-i18next';

import { Icon, type IconName } from '@/components/ui/icons';

const features: {
  key: 'bible' | 'sermons' | 'community' | 'prayer';
  icon: IconName;
}[] = [
  {
    key: 'bible',
    icon: 'book',
  },
  {
    key: 'sermons',
    icon: 'play',
  },
  {
    key: 'community',
    icon: 'members',
  },
  {
    key: 'prayer',
    icon: 'heart',
  },
];

export function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="relative bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1458B8]">
            {t('public.landing.featuresEyebrow')}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#081b31] sm:text-4xl">
            {t('public.landing.featuresTitle')}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.key}
              className="rounded-[28px] border border-white/20 bg-[#0c2443] p-7 shadow-lg backdrop-blur-xl transition duration-200 hover:bg-[#113159]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#1458B8]/20 text-white shadow-sm">
                <Icon name={feature.icon} size={25} />
              </div>

              <h3 className="text-lg font-bold text-white">
                {t(`public.landing.features.${feature.key}.title`)}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/80">
                {t(`public.landing.features.${feature.key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
