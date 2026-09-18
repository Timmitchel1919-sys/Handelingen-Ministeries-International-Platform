import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

interface RegistrationWizardProps {
  churchId: string;
}

export function RegistrationWizard({ churchId }: RegistrationWizardProps) {
  const { t } = useTranslation();
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
        memberType: 'member',
        country: formData.country,
        district: formData.district,
        phone: fullPhone,
        emergencyContact1: formData.emergencyContact1 ? { firstName: formData.emergencyContact1, lastName: '', relationship: formData.relationship1, phone: '' } : null,
        emergencyContact2: formData.emergencyContact2 ? { firstName: formData.emergencyContact2, lastName: '', relationship: formData.relationship2, phone: '' } : null,
        ministryInterest: formData.ministryInterests.join(', '),
        howDidYouHear: '',
      });

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
        <p className="mb-4 rounded-2xl border border-[#d9485f]/20 bg-[#d9485f]/10 px-4 py-3 text-sm font-medium text-[#a82d42]">
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
