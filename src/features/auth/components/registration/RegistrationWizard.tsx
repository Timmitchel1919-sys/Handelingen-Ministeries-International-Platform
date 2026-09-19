import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInYears } from 'date-fns';
import { WizardProgress } from './WizardProgress';
import { Step1Personal } from './Step1Personal';
import { Step2Background } from './Step2Background';
import { Step3Ministry } from './Step3Ministry';
import { Step4Contact } from './Step4Contact';
import { RegistrationSuccess } from './RegistrationSuccess';

import { registerWithEmail } from '@/services/auth-service';
import { logAuditEvent } from '@/services/audit-service';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/lib/validation';
import type { AuthAppError } from '@/lib/auth-errors';
import type { ChildRegistration } from '@/types/registration';

interface RegistrationWizardProps {
  churchId: string;
}

const MINIMUM_INDEPENDENT_ACCOUNT_AGE = 16;

export function RegistrationWizard({ churchId }: RegistrationWizardProps) {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    isBaptized: undefined as boolean | undefined,
    hasChildren: undefined as boolean | undefined,
    children: [] as ChildRegistration[],
    emergencyContact1: '',
    relationship1: '',
    emergencyContact2: '',
    relationship2: '',
    country: '',
    district: '',
    address: '',
    ministryInterests: [] as string[],
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'auth.validation.firstNameRequired';
    if (!formData.lastName.trim()) newErrors.lastName = 'auth.validation.lastNameRequired';
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'auth.validation.dobRequired';
    } else {
      const age = differenceInYears(new Date(), new Date(formData.dateOfBirth));
      if (age < MINIMUM_INDEPENDENT_ACCOUNT_AGE) {
        setFormError(t('auth.validation.ageUnder16', 'You must be at least 16 years old to create an independent Handelingen Ministries account. A parent or guardian can add you to their household.'));
        newErrors.dateOfBirth = 'auth.validation.ageUnder16';
      }
    }
    
    if (formData.isBaptized === undefined) newErrors.isBaptized = 'auth.validation.isBaptizedRequired';
    if (formData.hasChildren === undefined) newErrors.hasChildren = 'auth.validation.hasChildrenRequired';

    if (formData.hasChildren) {
      formData.children.forEach((child, index) => {
        if (!child.firstName.trim()) newErrors[`child_${index}_firstName`] = 'auth.validation.firstNameRequired';
        if (!child.lastName.trim()) newErrors[`child_${index}_lastName`] = 'auth.validation.lastNameRequired';
        if (!child.dateOfBirth) newErrors[`child_${index}_dateOfBirth`] = 'auth.validation.dobRequired';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    const emailResult = validateEmail(formData.email);
    if (emailResult.errorKey) newErrors.email = emailResult.errorKey;

    const passwordResult = validatePassword(formData.password);
    if (passwordResult.errorKey) newErrors.password = passwordResult.errorKey;

    const confirmResult = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (confirmResult.errorKey) newErrors.confirmPassword = confirmResult.errorKey;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setFormError(null);
    let isValid = true;

    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();

    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setFormError(null);
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setFormError(null);
    
    // Final age check just in case
    const age = differenceInYears(new Date(), new Date(formData.dateOfBirth));
    if (age < MINIMUM_INDEPENDENT_ACCOUNT_AGE) {
      setFormError(t('auth.validation.ageUnder16', 'You must be at least 16 years old to create an independent Handelingen Ministries account. A parent or guardian can add you to their household.'));
      return;
    }

    if (!validateStep4()) return;

    setIsSubmitting(true);

    try {
      const getPrefix = (country: string) => {
        switch (country) {
          case 'SR': return '+597';
          case 'NL': return '+31';
          case 'BE': return '+32';
          default: return '';
        }
      };

      const fullPhone = `${getPrefix(formData.country)}${formData.phone}`;
      
      const user = await registerWithEmail({
        email: formData.email,
        password: formData.password,
        churchId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        isBaptized: formData.isBaptized,
        hasChildren: formData.hasChildren,
        children: formData.hasChildren ? formData.children : [],
        memberType: 'member',
        country: formData.country,
        district: formData.district,
        phone: fullPhone,
        emergencyContact1: formData.emergencyContact1 ? { firstName: formData.emergencyContact1, lastName: '', relationship: formData.relationship1, phone: '' } : null,
        emergencyContact2: formData.emergencyContact2 ? { firstName: formData.emergencyContact2, lastName: '', relationship: formData.relationship2, phone: '' } : null,
        ministryInterest: formData.ministryInterests.join(', '),
        howDidYouHear: '',
      } as any); // cast for now as we added new fields to the form payload

      await logAuditEvent({
        actorUid: user.uid,
        actorRole: 'member',
        action: 'sign-up',
        resource: 'auth',
        resourceId: user.uid,
        churchId,
      });

      setIsSuccess(true);
    } catch (cause) {
      setFormError(t((cause as AuthAppError).messageKey || 'auth.errors.unknown'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <div className="w-full">
      <WizardProgress currentStep={currentStep} />
      
      {formError && (
        <p className="mb-4 rounded-2xl border border-[#d9485f]/20 bg-[#d9485f]/10 px-4 py-3 text-sm font-medium text-[#a82d42]" role="alert">
          {formError}
        </p>
      )}

      {currentStep === 1 && (
        <Step1Personal
          data={formData}
          updateData={updateData}
          onNext={handleNext}
          errors={errors}
        />
      )}
      {currentStep === 2 && (
        <Step2Background
          data={formData}
          updateData={updateData}
          onNext={handleNext}
          onPrev={handlePrev}
          errors={errors}
        />
      )}
      {currentStep === 3 && (
        <Step3Ministry
          data={formData}
          updateData={updateData}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {currentStep === 4 && (
        <Step4Contact
          data={formData}
          updateData={updateData}
          onSubmit={handleSubmit}
          onPrev={handlePrev}
          isSubmitting={isSubmitting}
          errors={errors}
        />
      )}
    </div>
  );
}
