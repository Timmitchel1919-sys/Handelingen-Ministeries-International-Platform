import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/app/config/app.config';
import { navItems } from '@/components/navigation/nav-items';
import { Icon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Rendered as a slide-in drawer on mobile instead of the inline rail. */
  variant?: 'rail' | 'drawer';
  onNavigate?: () => void;
}

/**
 * Primary navigation. Reads from the single `navItems` source of truth so
 * the destination list, icons and translation keys never drift from the
 * top navigation or route table.
 *
 * Role/permission-based filtering is intentionally not applied yet (see
 * AuthContext) - every item is visible in Layer 0. Later layers can filter
 * `navItems` by `hasPermission(resource + '.read')` without touching this
 * component's rendering logic.
 */
export function Sidebar({ collapsed, onToggleCollapsed, variant = 'rail', onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const isDrawer = variant === 'drawer';
  const isCollapsed = collapsed && !isDrawer;

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--color-border)] bg-surface transition-[width] duration-200',
        isDrawer ? 'w-full' : isCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]',
      )}
    >
      <div className="flex h-[var(--header-height)] items-center gap-2 px-4">
        <img src={appConfig.logoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        {!isCollapsed && (
          <span className="truncate text-sm font-semibold text-[var(--color-text)]">{t('appName')}</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Primary">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]',
                  )
                }
              >
                <Icon name={item.icon} size={20} aria-hidden="true" />
                {!isCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!isDrawer && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? t('shell.expandSidebar') : t('shell.collapseSidebar')}
          className="flex items-center justify-center gap-2 border-t border-[var(--color-border)] py-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={18} />
        </button>
      )}
    </aside>
  );
}
