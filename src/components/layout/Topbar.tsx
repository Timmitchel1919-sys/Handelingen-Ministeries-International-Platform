import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { GlobalSearch } from '@/components/navigation/GlobalSearch';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { NotificationButton } from '@/components/navigation/NotificationButton';
import { ShellIcon } from '@/components/navigation/ShellIcon';
import { ThemeControl } from '@/components/navigation/ThemeControl';
import { UserMenu } from '@/components/navigation/UserMenu';

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#D7E6F7] bg-surface/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left Area: Mobile Toggle & Breadcrumbs */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label={t('navigation.openMenu')}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D7E6F7] bg-surface text-[var(--color-text)] shadow-xs backdrop-blur hover:bg-[#F4F8FD] lg:hidden"
        >
          <ShellIcon name="menu" width={19} height={19} />
        </button>

        <div className="hidden min-w-0 lg:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Area: Search, Controls & User Menu */}
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <GlobalSearch />

        <NotificationButton />

        <ThemeControl />

        <LanguageSwitcher />

        <UserMenu />
      </div>
    </header>
  );
}
