import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  navigationItems,
  navigationSections,
} from '@/components/navigation/navigation.config';
import { ShellIcon } from '@/components/navigation/ShellIcon';
import { useAuth } from '@/features/auth/AuthContext';
import { signOutCurrentUser } from '@/services/auth-service';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  // Prevent body scrolling while open
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const isActive = (route: string) =>
    location.pathname === route ||
    (route !== '/dashboard' && location.pathname.startsWith(`${route}/`));

  const initials =
    user?.displayName
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'HM';

  const role =
    typeof user?.role === 'string' ? user.role : t('navigation.member');

  return (
    <div className="fixed inset-0 z-90 lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t('navigation.closeMenu')}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B2447]/30 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <aside
        className="relative flex h-full w-[min(85vw,340px)] flex-col border-r border-[#D7E6F7] bg-surface shadow-2xl transition-transform"
        aria-label={t('navigation.mobileNavigation')}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#E5EEF8] px-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#1458B8] to-[#6CA9EA] text-sm font-black text-white shadow-md shadow-[#1458B8]/20">
              HM
            </span>

            <div>
              <span className="block text-sm font-extrabold text-[var(--color-text)]">
                Handelingen
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Ministries
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('navigation.closeMenu')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-text)]/50 hover:bg-[#F4F8FD] hover:text-[var(--color-text)]"
          >
            <ShellIcon name="close" width={19} height={19} />
          </button>
        </div>

        {/* User Banner */}
        <div className="border-b border-[#E5EEF8] bg-[#F7FAFE] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#1458B8] to-[#6CA9EA] text-xs font-bold text-white shadow-xs">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-text)]">
                {user?.displayName || t('navigation.user')}
              </p>

              <p className="truncate text-xs font-medium capitalize text-[var(--color-primary)]">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigationSections
            .filter((section) => section.id !== 'profile')
            .map((section) => {
              const items = navigationItems.filter(
                (item) => item.section === section.id,
              );

              if (!items.length) return null;

              return (
                <div key={section.id} className="space-y-1">
                  <p className="mb-1 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-text)]/40">
                    {t(section.labelKey)}
                  </p>

                  {items.map((item) => {
                    const active = isActive(item.route);

                    return (
                      <NavLink
                        key={item.id}
                        to={item.route}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                          active
                            ? 'bg-[#EAF3FF] text-[var(--color-primary)]'
                            : 'text-[var(--color-text)]/70 hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <ShellIcon
                          name={item.icon}
                          width={19}
                          height={19}
                          className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]/50'}
                        />
                        <span>{t(item.labelKey)}</span>
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#E5EEF8] p-3 space-y-1">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text)]/70 hover:bg-[#F4F8FD]"
          >
            <ShellIcon name="profile" width={19} height={19} />
            {t('navigation.profile')}
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text)]/70 hover:bg-[#F4F8FD]"
          >
            <ShellIcon name="settings" width={19} height={19} />
            {t('navigation.settings')}
          </NavLink>

          <button
            type="button"
            onClick={() => {
              onClose();
              void signOutCurrentUser();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#A82D42] hover:bg-[#FFF1F3]"
          >
            <ShellIcon name="logout" width={19} height={19} />
            {t('common.signOut')}
          </button>
        </div>
      </aside>
    </div>
  );
}
