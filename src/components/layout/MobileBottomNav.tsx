import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ShellIcon } from '@/components/navigation/ShellIcon';

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    {
      id: 'dashboard',
      route: '/dashboard',
      icon: 'dashboard' as const,
      labelKey: 'navigation.dashboard',
    },
    {
      id: 'ministries',
      route: '/ministries',
      icon: 'ministries' as const,
      labelKey: 'navigation.ministries',
    },
    {
      id: 'members',
      route: '/members',
      icon: 'members' as const,
      labelKey: 'navigation.members',
    },
    {
      id: 'events',
      route: '/events',
      icon: 'events' as const,
      labelKey: 'navigation.events',
    },
  ];

  return (
    <nav
      aria-label={t('navigation.mobileNavigation')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D7E6F7] bg-surface/90 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(23,59,112,0.08)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const active =
            location.pathname === item.route ||
            (item.route !== '/dashboard' &&
              location.pathname.startsWith(`${item.route}/`));

          return (
            <NavLink
              key={item.id}
              to={item.route}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-bold transition ${
                active
                  ? 'bg-[#EAF3FF] text-[var(--color-primary)]'
                  : 'text-[var(--color-text)]/50 hover:text-[var(--color-text)]'
              }`}
            >
              <ShellIcon
                name={item.icon}
                width={19}
                height={19}
              />
              <span className="truncate">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('handelingen:open-mobile-menu'),
            );
          }}
          className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-bold text-[var(--color-text)]/50 hover:text-[var(--color-text)]"
        >
          <ShellIcon name="menu" width={19} height={19} />
          <span className="truncate">{t('navigation.more')}</span>
        </button>
      </div>
    </nav>
  );
}
