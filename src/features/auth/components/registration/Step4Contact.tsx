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
        <Input
          label={t('auth.validation.phone')}
          value={data.phone || ''}
          onChange={(e) => updateData({ phone: e.target.value })}
          className={prefix ? 'pl-16' : ''}
          icon={prefix ? <span className="font-bold text-text-muted">{prefix}</span> : undefined}
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
        <Button type="submit" size="lg" className="flex-1 bg-linear-to-b from-[#3FA9F5] to-[#1458B8] border border-white/20 text-white shadow-[0_10px_28px_rgba(20,88,184,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:from-[#5BC0FF] hover:to-[#0f4798]" isLoading={isSubmitting}>
          {t('auth.registerWizard.submit')}
        </Button>
      </div>
    </form>
  );
}
