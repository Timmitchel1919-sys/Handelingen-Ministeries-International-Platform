import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from 'lucide-react';
import { differenceInYears } from 'date-fns';

interface ChildRegistration {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface Step1Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export function Step1Personal({ data, updateData, onNext, errors = {} }: Step1Props) {
  const { t } = useTranslation('common');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleAddChild = () => {
    const children = data.children || [];
    updateData({ children: [...children, { firstName: '', lastName: '', dateOfBirth: '' }] });
  };

  const handleRemoveChild = (index: number) => {
    const children = [...(data.children || [])];
    children.splice(index, 1);
    updateData({ children });
  };

  const updateChild = (index: number, field: keyof ChildRegistration, value: string) => {
    const children = [...(data.children || [])];
    children[index] = { ...children[index], [field]: value };
    updateData({ children });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const age = differenceInYears(new Date(), new Date(dob));
    return isNaN(age) ? '' : age.toString();
  };

  const handleHasChildrenChange = (value: string) => {
    const hasChildren = value === 'true';
    if (!hasChildren) {
      // Clear children if they select NO
      updateData({ hasChildren, children: [] });
    } else {
      updateData({ hasChildren, children: data.children?.length ? data.children : [{ firstName: '', lastName: '', dateOfBirth: '' }] });
    }
  };

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label={t('auth.firstName', 'First Name')}
          value={data.firstName || ''}
          onChange={(e) => updateData({ firstName: e.target.value })}
          error={errors.firstName ? t(errors.firstName) : undefined}
          required
        />
        <Input
          label={t('auth.lastName', 'Last Name')}
          value={data.lastName || ''}
          onChange={(e) => updateData({ lastName: e.target.value })}
          error={errors.lastName ? t(errors.lastName) : undefined}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          type="date"
          label={t('auth.validation.dob', 'Date of Birth')}
          value={data.dateOfBirth || ''}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          error={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
          required
        />
        <Select
          label={t('auth.validation.gender', 'Gender')}
          value={data.gender || ''}
          onChange={(e) => updateData({ gender: e.target.value })}
          options={[
            { value: 'M', label: t('auth.gender.male', 'Male') },
            { value: 'F', label: t('auth.gender.female', 'Female') }
          ]}
          placeholder={t('auth.validation.gender', 'Select gender')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label={t('auth.validation.maritalStatus', 'Marital Status')}
          value={data.maritalStatus || ''}
          onChange={(e) => updateData({ maritalStatus: e.target.value })}
          options={[
            { value: 'single', label: t('auth.maritalStatus.single', 'Single') },
            { value: 'married', label: t('auth.maritalStatus.married', 'Married') },
            { value: 'divorced', label: t('auth.maritalStatus.divorced', 'Divorced') },
            { value: 'widowed', label: t('auth.maritalStatus.widowed', 'Widowed') }
          ]}
          placeholder={t('auth.validation.maritalStatus', 'Select status')}
        />

        <Select
          label={t('auth.validation.isBaptized', 'Baptized?')}
          value={data.isBaptized === undefined ? '' : String(data.isBaptized)}
          onChange={(e) => updateData({ isBaptized: e.target.value === 'true' })}
          options={[
            { value: 'true', label: t('auth.yes', 'Yes') },
            { value: 'false', label: t('auth.no', 'No') }
          ]}
          error={errors.isBaptized ? t(errors.isBaptized) : undefined}
          placeholder={t('auth.validation.isBaptized', 'Select')}
          required
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <Select
          label={t('auth.validation.hasChildren', 'Do you have children?')}
          value={data.hasChildren === undefined ? '' : String(data.hasChildren)}
          onChange={(e) => handleHasChildrenChange(e.target.value)}
          options={[
            { value: 'true', label: t('auth.yes', 'Yes') },
            { value: 'false', label: t('auth.no', 'No') }
          ]}
          placeholder={t('auth.validation.hasChildren', 'Select')}
          error={errors.hasChildren ? t(errors.hasChildren) : undefined}
          required
        />
      </div>

      {data.hasChildren && (
        <div className="flex flex-col gap-4 p-5 mt-2 bg-surface/30 backdrop-blur-md border border-white/20 rounded-2xl">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t('auth.childrenAttending', 'Children attending this church')}
            </h3>
            <p className="text-sm text-foreground/70">
              {t('auth.childrenAttendingHelp', 'Only add children who also attend this church.')}
            </p>
          </div>

          {(data.children || []).map((child: ChildRegistration, index: number) => {
            const age = calculateAge(child.dateOfBirth);
            return (
              <div key={index} className="flex flex-col gap-4 p-4 mt-2 bg-background/50 border border-white/10 rounded-xl relative">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-foreground">{t('auth.child', 'Child')} {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 px-2"
                    onClick={() => handleRemoveChild(index)}
                    aria-label={t('auth.removeChild', 'Remove child')}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">{t('auth.removeChild', 'Remove')}</span>
                  </Button>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={t('auth.firstName', 'First Name')}
                    value={child.firstName}
                    onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                    error={errors[`child_${index}_firstName`] ? t(errors[`child_${index}_firstName`]) : undefined}
                  />
                  <Input
                    label={t('auth.lastName', 'Last Name')}
                    value={child.lastName}
                    onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                    error={errors[`child_${index}_lastName`] ? t(errors[`child_${index}_lastName`]) : undefined}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="date"
                    label={t('auth.validation.dob', 'Date of Birth')}
                    value={child.dateOfBirth}
                    onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                    error={errors[`child_${index}_dateOfBirth`] ? t(errors[`child_${index}_dateOfBirth`]) : undefined}
                  />
                  <div className="flex flex-col justify-center pt-6">
                    {age !== '' && (
                      <span className="text-sm font-medium text-foreground/80">
                        {t('auth.age', 'Age')}: {age}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            className="mt-2 border-white/20 hover:bg-white/5"
            onClick={handleAddChild}
          >
            + {t('auth.addAnotherChild', 'Add another child')}
          </Button>
        </div>
      )}

      <div className="pt-4 border-t border-white/10 mt-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label={t('auth.validation.emergencyContact1', 'Emergency Contact 1')}
            value={data.emergencyContact1 || ''}
            onChange={(e) => updateData({ emergencyContact1: e.target.value })}
          />
          <Input
            label={t('auth.validation.relationship1', 'Relationship')}
            value={data.relationship1 || ''}
            onChange={(e) => updateData({ relationship1: e.target.value })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mt-5">
          <Input
            label={t('auth.validation.emergencyContact2', 'Emergency Contact 2')}
            value={data.emergencyContact2 || ''}
            onChange={(e) => updateData({ emergencyContact2: e.target.value })}
          />
          <Input
            label={t('auth.validation.relationship2', 'Relationship')}
            value={data.relationship2 || ''}
            onChange={(e) => updateData({ relationship2: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-4">
        {t('auth.registerWizard.next', 'Continue')}
      </Button>
    </form>
  );
}
