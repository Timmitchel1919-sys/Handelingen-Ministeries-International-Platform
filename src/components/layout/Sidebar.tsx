import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  navigationItems,
  navigationSections,
} from '@/components/navigation/navigation.config';
import { ShellIcon } from '@/components/navigation/ShellIcon';
import { useAuth } from '@/features/auth/AuthContext';
import { signOutCurrentUser } from '@/services/auth-service';
import { cn } from '@/utils/cn';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  variant?: 'rail' | 'drawer';
  onNavigate?: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  variant = 'rail',
  onNavigate,
}: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const isDrawer = variant === 'drawer';
  const isCollapsed = collapsed && !isDrawer;

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
    <aside
      aria-label={t('navigation.sections.main')}
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r border-[#D7E6F7] bg-surface/80 shadow-[4px_0_24px_rgba(23,59,112,0.03)] backdrop-blur-xl transition-all duration-300 z-30',
        isDrawer ? 'w-full' : isCollapsed ? 'w-20' : 'w-72',
      )}
    >
      {/* Branding Header */}
      <div className="flex h-20 items-center justify-between border-b border-[#E5EEF8] px-5">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#1458B8] to-[#6CA9EA] text-sm font-black text-white shadow-md shadow-[#1458B8]/20">
            HM
          </div>

          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden transition-all duration-200">
              <span className="block truncate text-sm font-extrabold tracking-tight text-[var(--color-text)]">
                Handelingen
              </span>
              <span className="block truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Ministries
              </span>
            </div>
          )}
        </NavLink>

        {!isDrawer && onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={isCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')}
            title={isCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D7E6F7] bg-surface/90 text-[var(--color-text)]/60 transition hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]',
              isCollapsed && 'hidden lg:flex',
            )}
          >
            <ShellIcon
              name="chevron-right"
              width={16}
              height={16}
              className={cn('transition-transform duration-200', !isCollapsed && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections
          .filter((section) => section.id !== 'profile')
          .map((section) => {
            const items = navigationItems.filter(
              (item) => item.section === section.id && (!item.permission || (user && hasPermission(item.permission as any))),
            );

            if (!items.length) return null;

            return (
              <div key={section.id} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-text)]/40">
                    {t(section.labelKey)}
                  </p>
                )}

                {items.map((item) => {
                  const active = isActive(item.route);

                  return (
                    <NavLink
                      key={item.id}
                      to={item.route}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      title={isCollapsed ? t(item.labelKey) : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-150',
                        isCollapsed ? 'justify-center' : '',
                        active
                          ? 'bg-[#EAF3FF] text-[var(--color-primary)] shadow-xs'
                          : 'text-[var(--color-text)]/70 hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]',
                      )}
                    >
                      <ShellIcon
                        name={item.icon}
                        width={20}
                        height={20}
                        className={cn('shrink-0 transition-colors', active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]/50')}
                      />

                      {!isCollapsed && (
                        <span className="truncate">{t(item.labelKey)}</span>
                      )}

                      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-[#1458B8] px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
      </nav>

      {/* Profile & Footer Section */}
      <div className="border-t border-[#E5EEF8] p-3 space-y-1">
        {/* User Card */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl bg-[#F7FAFE] p-2.5 border border-[#E5EEF8]',
            isCollapsed ? 'justify-center p-2' : '',
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#1458B8] to-[#6CA9EA] text-xs font-bold text-white shadow-xs">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </span>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[var(--color-text)]">
                {user?.displayName || t('navigation.user')}
              </p>
              <p className="truncate text-[11px] font-medium capitalize text-[var(--color-primary)]">
                {role}
              </p>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <NavLink
          to="/profile"
          onClick={onNavigate}
          title={isCollapsed ? t('navigation.profile') : undefined}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-text)]/70 transition hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]',
            isCollapsed && 'justify-center',
          )}
        >
          <ShellIcon name="profile" width={17} height={17} />
          {!isCollapsed && <span className="truncate">{t('navigation.profile')}</span>}
        </NavLink>

        {/* Settings Shortcut */}
        <NavLink
          to="/settings"
          onClick={onNavigate}
          title={isCollapsed ? t('navigation.settings') : undefined}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-text)]/70 transition hover:bg-[#F4F8FD] hover:text-[var(--color-primary)]',
            isCollapsed && 'justify-center',
          )}
        >
          <ShellIcon name="settings" width={17} height={17} />
          {!isCollapsed && <span className="truncate">{t('navigation.settings')}</span>}
        </NavLink>

        {/* Sign Out Action */}
        <button
          type="button"
          onClick={() => void signOutCurrentUser()}
          title={isCollapsed ? t('common.signOut') : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[#A82D42] transition hover:bg-[#FFF1F3]',
            isCollapsed && 'justify-center',
          )}
        >
          <ShellIcon name="logout" width={17} height={17} />
          {!isCollapsed && <span className="truncate">{t('common.signOut')}</span>}
        </button>
      </div>
    </aside>
  );
}
