import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommandPalette } from './CommandPalette';
import { ShellIcon } from './ShellIcon';

export function GlobalSearch() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('search.open')}
        className="hidden h-10 min-w-56 items-center gap-3 rounded-xl border border-[#D7E6F7] bg-surface/75 px-3 text-left text-sm text-[var(--color-text)]/50 shadow-sm backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[#1458B8]/30 md:flex"
      >
        <ShellIcon name="search" width={17} height={17} className="text-[var(--color-primary)]" />

        <span className="flex-1 truncate">
          {t('search.placeholder')}
        </span>

        <kbd className="rounded-md border border-[#D7E6F7] bg-[#F7FAFE] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text)]/50">
          Ctrl K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('search.open')}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7E6F7] bg-surface/75 text-[var(--color-text)] shadow-sm backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface md:hidden"
      >
        <ShellIcon name="search" width={18} height={18} />
      </button>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
