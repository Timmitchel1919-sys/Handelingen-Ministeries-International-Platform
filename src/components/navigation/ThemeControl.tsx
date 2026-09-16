import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeMode } from '@/app/providers/ThemeProvider';
import { ShellIcon } from './ShellIcon';

export function ThemeControl() {
  const { mode, setMode } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; labelKey: string; icon: 'sun' | 'moon' | 'monitor' }[] = [
    { mode: 'light', labelKey: 'navigation.themeLight', icon: 'sun' },
    { mode: 'dark', labelKey: 'navigation.themeDark', icon: 'moon' },
    { mode: 'system', labelKey: 'navigation.themeSystem', icon: 'monitor' },
  ];

  const currentIcon = mode === 'dark' ? 'moon' : mode === 'system' ? 'monitor' : 'sun';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('navigation.theme')}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7E6F7] bg-surface/75 text-[var(--color-text)] shadow-sm backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[#1458B8]/30"
      >
        <ShellIcon name={currentIcon} width={18} height={18} className="text-[var(--color-primary)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-40 overflow-hidden rounded-2xl border border-[#D7E6F7] bg-surface p-1.5 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => {
                setMode(opt.mode);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                mode === opt.mode
                  ? 'bg-[#EAF3FF] text-[var(--color-primary)]'
                  : 'text-[var(--color-text)]/75 hover:bg-[#F4F8FD]'
              }`}
            >
              <ShellIcon name={opt.icon} width={16} height={16} />
              <span>{t(opt.labelKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
