import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { navItems } from '@/components/navigation/nav-items';
import { Drawer } from '@/components/ui/Drawer';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

/**
 * Application shell: responsive layout combining the sidebar, top
 * navigation and a routed content area. Mounted once at the router root
 * (see AppRoutes) so no page re-implements this layout.
 */
export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = useMemo(
    () => navItems.find((item) => location.pathname.startsWith(item.path)),
    [location.pathname],
  );

  const breadcrumb = useMemo(() => {
    if (!activeItem && location.pathname.startsWith('/profile')) {
      return [
        { label: t('navigation.dashboard'), path: '/dashboard' },
        { label: t('common.profile') },
      ];
    }
    return [
      { label: t('navigation.dashboard'), path: '/dashboard' },
      ...(activeItem && activeItem.path !== '/dashboard' ? [{ label: t(activeItem.labelKey) }] : []),
    ];
  }, [activeItem, location.pathname, t]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
      </div>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title={t('appName')} side="left">
        <Sidebar
          collapsed={false}
          onToggleCollapsed={() => {}}
          variant="drawer"
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar breadcrumb={breadcrumb} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
