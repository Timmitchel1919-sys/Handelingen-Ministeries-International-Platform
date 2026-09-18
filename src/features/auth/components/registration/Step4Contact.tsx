import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/icons';

interface Step4Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  errors?: Record<string, string>;
}

export function Step4Contact({ data, updateData, onSubmit, onPrev, isSubmitting, errors = {} }: Step4Props) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const getPrefix = (country: string) => {
    switch (country) {
      case 'SR': return '+597';
      case 'NL': return '+31';
      case 'BE': return '+32';
      default: return '';
    }
  };

  const prefix = getPrefix(data.country);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-[34px] -translate-y-1/2 text-sm text-[var(--color-text)]/50 z-10">
            {prefix}
          </span>
        )}
        <Input
          label={t('auth.validation.phone')}
          value={data.phone || ''}
          onChange={(e) => updateData({ phone: e.target.value })}
          className={prefix ? 'pl-14' : ''}
          required
          error={errors.phone ? t(errors.phone) : undefined}
        />
      </div>

      <Input
        label={t('auth.email')}
        type="email"
        value={data.email || ''}
        onChange={(e) => updateData({ email: e.target.value })}
        icon={<Icon name="mail" size={18} />}
        required
        error={errors.email ? t(errors.email) : undefined}
      />

      <PasswordInput
        label={t('auth.password')}
        value={data.password || ''}
        onChange={(e) => updateData({ password: e.target.value })}
        required
        error={errors.password ? t(errors.password) : undefined}
      />

      <PasswordInput
        label={t('auth.confirmPassword')}
        value={data.confirmPassword || ''}
        onChange={(e) => updateData({ confirmPassword: e.target.value })}
        required
        error={errors.confirmPassword ? t(errors.confirmPassword) : undefined}
      />

      <div className="flex gap-3 mt-4">
        <Button type="button" variant="outline" size="lg" onClick={onPrev} className="flex-1" disabled={isSubmitting}>
          {t('auth.registerWizard.previous')}
        </Button>
        <Button type="submit" size="lg" className="flex-1" isLoading={isSubmitting}>
          {t('auth.registerWizard.submit')}
        </Button>
      </div>
    </form>
  );
}
