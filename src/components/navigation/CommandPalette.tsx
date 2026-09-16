import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { navigationItems, type ShellIconName } from './navigation.config';
import { ShellIcon } from './ShellIcon';
import { signOutCurrentUser } from '@/services/auth-service';

type CommandItem = {
  id: string;
  labelKey: string;
  route?: string;
  icon: ShellIconName;
  action?: () => void | Promise<void>;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = navigationItems.map((item) => ({
      id: item.id,
      labelKey: item.labelKey,
      route: item.route,
      icon: item.icon,
    }));

    items.push({
      id: 'sign-out',
      labelKey: 'common.signOut',
      icon: 'logout',
      action: async () => {
        await signOutCurrentUser();
      },
    });

    return items;
  }, []);

  const filteredCommands = useMemo(
    () =>
      allCommands.filter((item) =>
        t(item.labelKey)
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [allCommands, query, t],
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredCommands.length === 0
            ? 0
            : (current + 1) % filteredCommands.length,
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) =>
          filteredCommands.length === 0
            ? 0
            : (current - 1 + filteredCommands.length) % filteredCommands.length,
        );
        return;
      }

      if (event.key === 'Enter' && filteredCommands[selectedIndex]) {
        event.preventDefault();
        const selected = filteredCommands[selectedIndex];
        onClose();
        if (selected.route) {
          navigate(selected.route);
        } else if (selected.action) {
          void selected.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredCommands, navigate, onClose, open, selectedIndex]);

  if (!open) {
    return null;
  }

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      void item.action();
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-[#0B2447]/30 px-4 pt-[10vh] backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('search.title')}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D7E6F7] bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[#E5EEF8] px-5">
          <ShellIcon
            name="search"
            width={20}
            height={20}
            className="text-[var(--color-primary)]"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('search.placeholder')}
            className="h-16 flex-1 bg-transparent text-base font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label={t('search.close')}
            className="rounded-lg border border-[#D7E6F7] bg-[#F7FAFE] px-2 py-1 text-xs font-semibold text-[var(--color-text)]/50 hover:bg-[#EEF6FF]"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ShellIcon
                name="search"
                width={30}
                height={30}
                className="mx-auto text-[var(--color-text)]/20"
              />

              <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                {t('search.noResults')}
              </p>

              <p className="mt-1 text-xs text-[var(--color-text)]/45">
                {t('search.noResultsDescription')}
              </p>
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                type="button"
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => handleSelect(command)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  index === selectedIndex
                    ? 'bg-[#EAF3FF] text-[var(--color-primary)]'
                    : 'text-[var(--color-text)]/75 hover:bg-[#F4F8FD]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    index === selectedIndex
                      ? 'bg-surface shadow-xs'
                      : 'bg-[#F4F8FD]'
                  }`}
                >
                  <ShellIcon
                    name={command.icon}
                    width={18}
                    height={18}
                  />
                </span>

                <span className="flex-1 text-sm font-semibold">
                  {t(command.labelKey)}
                </span>

                <ShellIcon
                  name="chevron-right"
                  width={16}
                  height={16}
                  className="opacity-40"
                />
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[#E5EEF8] bg-[#F9FBFE] px-5 py-3 text-[11px] font-medium text-[var(--color-text)]/50">
          <span>
            ↑↓ {t('search.navigate')}
          </span>
          <span>↵ {t('search.select')}</span>
          <span>ESC {t('search.close')}</span>
        </div>
      </div>
    </div>
  );
}
