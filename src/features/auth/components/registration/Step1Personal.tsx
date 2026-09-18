import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface Step1Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export function Step1Personal({ data, updateData, onNext, errors = {} }: Step1Props) {
  const { t } = useTranslation();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('auth.firstName')}
          value={data.firstName || ''}
          onChange={(e) => updateData({ firstName: e.target.value })}
          error={errors.firstName ? t(errors.firstName) : undefined}
          required
        />
        <Input
          label={t('auth.lastName')}
          value={data.lastName || ''}
          onChange={(e) => updateData({ lastName: e.target.value })}
          error={errors.lastName ? t(errors.lastName) : undefined}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          type="date"
          label={t('auth.validation.dob')}
          value={data.dateOfBirth || ''}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          error={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
        />
        <Select
          label={t('auth.validation.gender')}
          value={data.gender || ''}
          onChange={(e) => updateData({ gender: e.target.value })}
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' }
          ]}
          placeholder="Select gender"
        />
      </div>

      <Select
        label={t('auth.validation.maritalStatus')}
        value={data.maritalStatus || ''}
        onChange={(e) => updateData({ maritalStatus: e.target.value })}
        options={[
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' }
        ]}
        placeholder="Select status"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('auth.validation.emergencyContact1')}
          value={data.emergencyContact1 || ''}
          onChange={(e) => updateData({ emergencyContact1: e.target.value })}
        />
        <Input
          label={t('auth.validation.relationship1')}
          value={data.relationship1 || ''}
          onChange={(e) => updateData({ relationship1: e.target.value })}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('auth.validation.emergencyContact2')}
          value={data.emergencyContact2 || ''}
          onChange={(e) => updateData({ emergencyContact2: e.target.value })}
        />
        <Input
          label={t('auth.validation.relationship2')}
          value={data.relationship2 || ''}
          onChange={(e) => updateData({ relationship2: e.target.value })}
        />
      </div>

      <Button type="submit" size="lg" className="w-full mt-4">
        {t('auth.registerWizard.next')}
      </Button>
    </form>
  );
}
