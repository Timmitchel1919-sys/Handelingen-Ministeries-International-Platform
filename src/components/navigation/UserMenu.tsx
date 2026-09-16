import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/features/auth/AuthContext';
import { signOutCurrentUser } from '@/services/auth-service';
import { ShellIcon } from './ShellIcon';

export function UserMenu() {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    t('navigation.user');

  const email = user?.email ?? '';

  const role =
    typeof user?.role === 'string'
      ? user.role
      : t('navigation.member');

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleSignOut = async () => {
    setOpen(false);
    await signOutCurrentUser();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={t('navigation.userMenu')}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex max-w-56 items-center gap-2.5 rounded-2xl border border-[#D7E6F7] bg-surface/75 px-2.5 py-1.5 shadow-xs backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[#1458B8]/30"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#1458B8] to-[#6CA9EA] text-xs font-bold text-white shadow-xs">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials || 'HM'
          )}
        </span>

        <span className="hidden min-w-0 text-left lg:block">
          <span className="block truncate text-xs font-bold text-[var(--color-text)]">
            {displayName}
          </span>
          <span className="block truncate text-[11px] font-medium text-[var(--color-primary)] capitalize">
            {role}
          </span>
        </span>

        <ShellIcon
          name="chevron-down"
          width={14}
          height={14}
          className="hidden shrink-0 text-[var(--color-text)]/40 lg:block"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-[#D7E6F7] bg-surface p-2 shadow-xl">
          <div className="border-b border-[#E5EEF8] px-3 py-3">
            <p className="truncate text-sm font-bold text-[var(--color-text)]">
              {displayName}
            </p>

            <p className="mt-0.5 truncate text-xs text-[var(--color-text)]/50">
              {email}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-[#EAF3FF] px-2.5 py-0.5 text-[11px] font-bold capitalize text-[var(--color-primary)]">
              {role}
            </span>
          </div>

          <div className="mt-1 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--color-text)]/75 transition hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]"
            >
              <ShellIcon name="profile" width={17} height={17} />
              {t('navigation.profile')}
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--color-text)]/75 transition hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]"
            >
              <ShellIcon name="settings" width={17} height={17} />
              {t('navigation.settings')}
            </Link>

            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#A82D42] transition hover:bg-[#FFF1F3]"
            >
              <ShellIcon name="logout" width={17} height={17} />
              {t('common.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
