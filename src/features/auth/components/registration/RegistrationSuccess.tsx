import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui/icons';

export function RegistrationSuccess() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
        <Icon name="check" size={48} className="text-green-500 font-bold" />
      </div>
      <h2 className="text-2xl font-bold text-green-500 mb-3">
        {i18n.language === 'nl' 
          ? 'BEVESTIG JE E-MAIL VIA DE LINK DIE WE NAAR JE E-MAILADRES HEBBEN GESTUURD.' 
          : 'VERIFY YOUR EMAIL USING THE LINK WE SENT TO YOUR EMAIL ADDRESS.'}
      </h2>
      <p className="text-[var(--color-text)]/70">
        {t('auth.registerWizard.success.subtitle', 'You can safely close this window once verified.')}
      </p>
    </div>
  );
}
