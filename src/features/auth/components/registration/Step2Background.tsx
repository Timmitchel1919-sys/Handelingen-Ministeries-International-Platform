import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface Step2Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors?: Record<string, string>;
}

export function Step2Background({ data, updateData, onNext, onPrev, errors = {} }: Step2Props) {
  const { t } = useTranslation();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const countries = [
    { value: 'SR', label: 'Suriname' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' }
  ];

  const getDistricts = (country: string) => {
    switch (country) {
      case 'SR': return [{ value: 'Paramaribo', label: 'Paramaribo' }, { value: 'Wanica', label: 'Wanica' }, { value: 'Nickerie', label: 'Nickerie' }];
      case 'NL': return [{ value: 'Amsterdam', label: 'Amsterdam' }, { value: 'Rotterdam', label: 'Rotterdam' }, { value: 'Den Haag', label: 'Den Haag' }];
      case 'BE': return [{ value: 'Brussels', label: 'Brussels' }, { value: 'Antwerp', label: 'Antwerp' }, { value: 'Ghent', label: 'Ghent' }];
      default: return [];
    }
  };

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-5">
      <Select
        label={t('auth.validation.country')}
        value={data.country || ''}
        onChange={(e) => {
          updateData({ country: e.target.value, district: '' });
        }}
        options={countries}
        placeholder="Select country"
        required
        error={errors.country ? t(errors.country) : undefined}
      />

      <Select
        label={t('auth.validation.districtCity')}
        value={data.district || ''}
        onChange={(e) => updateData({ district: e.target.value })}
        options={getDistricts(data.country || '')}
        placeholder="Select district/city"
        disabled={!data.country}
        required
        error={errors.district ? t(errors.district) : undefined}
      />

      <Input
        label={t('auth.validation.address')}
        value={data.address || ''}
        onChange={(e) => updateData({ address: e.target.value })}
        required
        error={errors.address ? t(errors.address) : undefined}
      />

      <div className="flex gap-3 mt-4">
        <Button type="button" variant="outline" size="lg" onClick={onPrev} className="flex-1">
          {t('auth.registerWizard.previous')}
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          {t('auth.registerWizard.next')}
        </Button>
      </div>
    </form>
  );
}
