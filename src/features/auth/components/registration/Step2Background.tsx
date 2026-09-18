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
  const { t, i18n } = useTranslation();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const countries = [
    { value: 'SR', label: i18n.language === 'nl' ? 'Suriname' : 'Suriname' },
    { value: 'NL', label: i18n.language === 'nl' ? 'Nederland' : 'Netherlands' },
    { value: 'BE', label: i18n.language === 'nl' ? 'België' : 'Belgium' }
  ];

  const getSubdivisions = (country: string) => {
    switch (country) {
      case 'SR': 
        return [
          'Brokopondo', 'Commewijne', 'Coronie', 'Marowijne', 'Nickerie', 
          'Para', 'Paramaribo', 'Saramacca', 'Sipaliwini', 'Wanica'
        ].map(d => ({ value: d, label: d }));
      case 'NL': 
        return [
          'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 
          'Limburg', 'Noord-Brabant', 'Noord-Holland', 'Overijssel', 'Utrecht', 
          'Zeeland', 'Zuid-Holland'
        ].map(p => ({ value: p, label: p }));
      case 'BE': 
        return [
          'Antwerpen', 'Limburg', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'West-Vlaanderen', 
          'Henegouwen', 'Luik', 'Luxemburg', 'Namen', 'Waals-Brabant', 'Brussels'
        ].map(p => ({ value: p, label: p }));
      default: return [];
    }
  };

  const getSubdivisionLabel = (country: string) => {
    if (country === 'SR') return 'District';
    if (country === 'NL' || country === 'BE') return i18n.language === 'nl' ? 'Provincie' : 'Province';
    return t('auth.validation.districtCity');
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
        placeholder={t('auth.validation.country')}
        required
        error={errors.country ? t(errors.country) : undefined}
      />

      <Select
        label={getSubdivisionLabel(data.country || '')}
        value={data.district || ''}
        onChange={(e) => updateData({ district: e.target.value })}
        options={getSubdivisions(data.country || '')}
        placeholder={getSubdivisionLabel(data.country || '')}
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
        <Button type="submit" size="lg" className="flex-1 bg-linear-to-b from-[#3FA9F5] to-[#1458B8] border border-white/20 text-white shadow-[0_10px_28px_rgba(20,88,184,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:from-[#5BC0FF] hover:to-[#0f4798]">
          {t('auth.registerWizard.next')}
        </Button>
      </div>
    </form>
  );
}
