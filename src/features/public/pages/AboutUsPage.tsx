import { useTranslation } from 'react-i18next';
import { GlobalPublicHeader } from '@/components/public/GlobalPublicHeader';

export function AboutUsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <GlobalPublicHeader />
      <main className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">{t('public.navigation.aboutUs', 'About Us')}</h1>
        <p className="mt-4 text-text/75">Coming soon...</p>
      </main>
    </div>
  );
}

