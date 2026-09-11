import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { appConfig } from '@/app/config/app.config';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAuth } from '@/features/auth/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/icons';
import { SearchInput } from '@/components/ui/SearchInput';
import { logAuditEvent } from '@/services/audit-service';
import { signOutCurrentUser } from '@/services/auth-service';

export interface TopbarProps {
  breadcrumb: BreadcrumbItem[];
  onOpenMobileMenu: () => void;
}

/**
 * Reusable top navigation. Provides the chrome (breadcrumb, global search,
 * notifications entry point, language selector, account menu) that every
 * page reuses - individual pages only set the breadcrumb via their route.
 */
export function Topbar({ breadcrumb, onOpenMobileMenu }: TopbarProps) {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName ?? user?.email ?? 'Guest';

  const handleSignOut = async () => {
    if (user) {
      await logAuditEvent({
        actorUid: user.id,
        actorRole: user.role,
        action: 'sign-out',
        resource: 'auth',
        resourceId: user.id,
        churchId: user.churchId,
      });
    }
    await signOutCurrentUser();
    navigate('/', { replace: true });
  };

  return (
    <header className="flex h-[var(--header-height)] items-center gap-3 border-b border-[var(--color-border)] bg-surface px-4">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label={t('shell.openMenu')}
        className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="hidden md:block">
        <Breadcrumb items={breadcrumb} />
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:flex-none">
        <div className="hidden w-64 sm:block">
          <SearchInput placeholder={t('shell.searchPlaceholder')} aria-label={t('common.search')} />
        </div>

        <Dropdown
          align="end"
          trigger={
            <span className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]" aria-label={t('common.language')}>
              <Icon name="globe" size={20} />
            </span>
          }
          items={appConfig.supportedLocales.map((locale) => ({
            key: locale,
            label: locale.toUpperCase(),
            onSelect: () => void i18n.changeLanguage(locale),
          }))}
        />

        <Dropdown
          align="end"
          trigger={
            <span className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]" aria-label={t('common.theme')}>
              <Icon name={mode === 'dark' ? 'moon' : mode === 'light' ? 'sun' : 'monitor'} size={20} />
            </span>
          }
          items={[
            { key: 'light', label: t('common.light'), onSelect: () => setMode('light') },
            { key: 'dark', label: t('common.dark'), onSelect: () => setMode('dark') },
            { key: 'system', label: t('common.system'), onSelect: () => setMode('system') },
          ]}
        />

        <span className="relative rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]">
          <Icon name="bell" size={20} aria-hidden="true" />
          <span className="sr-only">{t('navigation.notifications')}</span>
        </span>

        <Dropdown
          align="end"
          trigger={<Avatar name={displayName} size={32} />}
          items={[
            { key: 'profile', label: t('common.profile'), onSelect: () => navigate('/profile') },
            { key: 'settings', label: t('navigation.settings'), onSelect: () => navigate('/settings') },
            { key: 'sign-out', label: t('common.signOut'), onSelect: () => void handleSignOut(), danger: true },
          ]}
        />
      </div>
    </header>
  );
}
