import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface Step3Props {
  data: any;
  updateData: (data: Partial<any>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Ministry({ data, updateData, onNext, onPrev }: Step3Props) {
  const { t } = useTranslation();

  const ministries = [
    { id: 'media', label: t('auth.registerWizard.ministries.media') },
    { id: 'praise', label: t('auth.registerWizard.ministries.praise') },
    { id: 'youth', label: t('auth.registerWizard.ministries.youth') },
    { id: 'children', label: t('auth.registerWizard.ministries.children') },
    { id: 'evangelism', label: t('auth.registerWizard.ministries.evangelism') },
    { id: 'usher', label: t('auth.registerWizard.ministries.usher') },
    { id: 'facility', label: t('auth.registerWizard.ministries.facility') },
  ];

  const selected = data.ministryInterests || [];

  const toggleMinistry = (id: string) => {
    const next = selected.includes(id) 
      ? selected.filter((s: string) => s !== id)
      : [...selected, id];
    updateData({ ministryInterests: next });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-5">
      <p className="text-sm text-[var(--color-text)]/70 mb-2">
        Optional: Select the ministries you are interested in joining.
      </p>

      <div className="flex flex-wrap gap-3">
        {ministries.map((m) => {
          const isSelected = selected.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMinistry(m.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-white/20 shadow-sm backdrop-blur-md",
                isSelected 
                  ? "bg-[#1458B8] text-white border-[#1458B8]" 
                  : "bg-surface/50 text-[var(--color-text)] hover:bg-surface/80"
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
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
