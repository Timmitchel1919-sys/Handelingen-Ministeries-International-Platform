import { AppProviders } from '@/app/providers/AppProviders';
import { AppRoutes } from '@/app/routes/AppRoutes';
import { BrandedSplashScreen } from '@/components/splash/BrandedSplashScreen';

export default function App() {
  return (
    <AppProviders>
      <BrandedSplashScreen />
      <AppRoutes />
    </AppProviders>
  );
}
