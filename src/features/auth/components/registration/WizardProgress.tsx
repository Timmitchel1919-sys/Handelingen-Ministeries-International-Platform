import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icons';

interface WizardProgressProps {
  currentStep: number;
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  const { t } = useTranslation();

  const steps = [
    t('auth.registerWizard.step1'),
    t('auth.registerWizard.step2'),
    t('auth.registerWizard.step3'),
    t('auth.registerWizard.step4'),
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between relative">
        <div className="absolute left-0 top-4 -z-10 h-[2px] w-full bg-[#1458B8]/20">
          <div 
            className="h-full bg-[#1458B8] transition-all duration-300"
            style={{ width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isActive ? "border-[#1458B8] bg-[#1458B8] text-white" : 
                  isCompleted ? "border-[#1458B8] bg-[#1458B8] text-white" : 
                  "border-[#1458B8]/30 bg-surface text-[#1458B8]/50"
                )}
              >
                {isCompleted ? (
                  <Icon name="check" size={16} />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>
              <span 
                className={cn(
                  "text-xs font-medium max-w-[80px] text-center",
                  isActive || isCompleted ? "text-[#1458B8]" : "text-[var(--color-text)]/50"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
