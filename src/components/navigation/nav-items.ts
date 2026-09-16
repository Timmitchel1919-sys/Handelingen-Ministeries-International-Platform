import type { PermissionResource } from '@/types/auth';
import { navigationItems } from './navigation.config';

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

export const navItems: NavItem[] = navigationItems
  .filter(item => item.id !== 'profile')
  .map(item => ({
    key: item.id,
    labelKey: item.labelKey,
    path: item.route,
    icon: item.icon as NavIconName,
    resource: item.id as PermissionResource,
  }));
