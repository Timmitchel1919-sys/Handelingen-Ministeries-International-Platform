import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellIcon } from './ShellIcon';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language?.startsWith('nl') ? 'nl' : 'en';

  const languages = [
    { code: 'en', label: t('navigation.english'), flag: '🇺🇸' },
    { code: 'nl', label: t('navigation.dutch'), flag: '🇳🇱' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('navigation.language')}
        aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-xl border border-[#D7E6F7] bg-surface/75 px-3 text-xs font-bold text-[var(--color-text)] shadow-sm backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[#1458B8]/30"
      >
        <ShellIcon name="globe" width={17} height={17} className="text-[var(--color-primary)]" />
        <span className="uppercase">{currentLanguage}</span>
        <ShellIcon name="chevron-down" width={14} height={14} className="text-[var(--color-text)]/40" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-36 overflow-hidden rounded-2xl border border-[#D7E6F7] bg-surface p-1.5 shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                currentLanguage === lang.code
                  ? 'bg-[#EAF3FF] text-[var(--color-primary)]'
                  : 'text-[var(--color-text)]/75 hover:bg-[#F4F8FD]'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
