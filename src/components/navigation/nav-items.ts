import type { PermissionResource } from '@/types/auth';

/**
 * Single source of truth for primary navigation.
 *
 * Sidebar, top-nav breadcrumbs and route guards all read from this list so
 * navigation is never redefined in more than one place. `resource` ties each
 * destination to the permission model (`resource.read` gates visibility);
 * Layer 0 leaves every route open (no roles resolve yet - see AuthContext),
 * later layers can filter this list by `hasPermission(resource + '.read')`
 * without changing its shape.
 */
export interface NavItem {
  key: string;
  labelKey: string;
  path: string;
  icon: NavIconName;
  resource: PermissionResource;
}

export type NavIconName =
  | 'dashboard'
  | 'ministries'
  | 'departments'
  | 'members'
  | 'leaders'
  | 'events'
  | 'documents'
  | 'tasks'
  | 'reports'
  | 'notifications'
  | 'settings';

export const navItems: NavItem[] = [
  { key: 'dashboard', labelKey: 'navigation.dashboard', path: '/dashboard', icon: 'dashboard', resource: 'dashboard' },
  { key: 'ministries', labelKey: 'navigation.ministries', path: '/ministries', icon: 'ministries', resource: 'ministries' },
  { key: 'departments', labelKey: 'navigation.departments', path: '/departments', icon: 'departments', resource: 'departments' },
  { key: 'members', labelKey: 'navigation.members', path: '/members', icon: 'members', resource: 'members' },
  { key: 'leaders', labelKey: 'navigation.leaders', path: '/leaders', icon: 'leaders', resource: 'leaders' },
  { key: 'events', labelKey: 'navigation.events', path: '/events', icon: 'events', resource: 'events' },
  { key: 'documents', labelKey: 'navigation.documents', path: '/documents', icon: 'documents', resource: 'documents' },
  { key: 'tasks', labelKey: 'navigation.tasks', path: '/tasks', icon: 'tasks', resource: 'tasks' },
  { key: 'reports', labelKey: 'navigation.reports', path: '/reports', icon: 'reports', resource: 'reports' },
  { key: 'notifications', labelKey: 'navigation.notifications', path: '/notifications', icon: 'notifications', resource: 'notifications' },
  { key: 'settings', labelKey: 'navigation.settings', path: '/settings', icon: 'settings', resource: 'settings' },
];
