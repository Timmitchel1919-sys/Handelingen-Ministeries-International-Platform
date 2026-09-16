import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MainContent } from './MainContent';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const SIDEBAR_STORAGE_KEY = 'handelingen.sidebar.collapsed';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      // Local storage can be unavailable in restricted environments.
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setSidebarCollapsed((value) => !value);
      }
    };

    const handleMobileMenuEvent = () => {
      setMobileMenuOpen(true);
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    window.addEventListener('handelingen:open-mobile-menu', handleMobileMenuEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcut);
      window.removeEventListener('handelingen:open-mobile-menu', handleMobileMenuEvent);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-[var(--color-text)]">
      {/* Fixed Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* Main Layout Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <MainContent>
          <Outlet />
        </MainContent>
      </div>

      {/* Mobile Overlay & Drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
