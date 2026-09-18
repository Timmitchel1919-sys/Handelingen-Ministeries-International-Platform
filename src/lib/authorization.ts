import type { AuthUser, Permission, PermissionAction, PermissionResource, RoleName } from '@/types/auth';

/**
 * Centralized authorization: the ONLY place role -> permission mappings
 * are defined. Never grant a permission ad hoc in a component or service -
 * add it to the relevant role here instead.
 *
 * This map never leaves the client bundle as writable data - it's a static
 * lookup, not something read from (or writable to) Firestore, so a client
 * can't grant itself a permission by editing a database document. The
 * document a client CAN write only ever names a `role` (see
 * services/user-profile-service.ts), and Firestore rules restrict which
 * roles a client may set on itself (see firestore.rules) - this table is
 * what turns that role into permissions on the client, mirrored by
 * equivalent checks in firestore.rules for anything Firestore itself must
 * protect.
 */
const ALL_RESOURCES: PermissionResource[] = [
  'dashboard',
  'organization',
  'ministries',
  'departments',
  'teams',
  'organizationMembers',
  'leadership',
  'members',
  'leaders',
  'events',
  'eventRegistrations',
  'attendance',
  'groups',
  'volunteers',
  'servingTeams',
  'schedules',
  'assignments',
  'documents',
  'tasks',
  'reports',
  'notifications',
  'settings',
  'hrm',
  'church',
  'users',
  'registrations',
  'households',
  'transfers',
];
const ALL_ACTIONS: PermissionAction[] = ['read', 'create', 'update', 'delete', 'manage'];

function perms(resource: PermissionResource, actions: PermissionAction[]): Permission[] {
  return actions.map((action) => `${resource}.${action}` as Permission);
}

function allPermissions(): Permission[] {
  return ALL_RESOURCES.flatMap((resource) => perms(resource, ALL_ACTIONS));
}

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  member: [
    ...perms('dashboard', ['read']),
    ...perms('events', ['read']),
    ...perms('eventRegistrations', ['read', 'create', 'update', 'delete']),
    ...perms('groups', ['read']),
    ...perms('schedules', ['read']),
    ...perms('assignments', ['read', 'update']),
    ...perms('volunteers', ['read', 'update']),
    ...perms('documents', ['read']),
    ...perms('notifications', ['read', 'update']),
  ],
  leader: [
    ...perms('dashboard', ['read']),
    ...perms('members', ['read']),
    ...perms('events', ['read', 'create', 'update']),
    ...perms('eventRegistrations', ['read', 'create', 'update', 'delete']),
    ...perms('attendance', ['read', 'create', 'update']),
    ...perms('groups', ['read', 'create', 'update', 'manage']),
    ...perms('schedules', ['read', 'create', 'update']),
    ...perms('assignments', ['read', 'create', 'update', 'delete']),
    ...perms('volunteers', ['read', 'update']),
    ...perms('servingTeams', ['read']),
    ...perms('documents', ['read']),
    ...perms('tasks', ['read', 'create', 'update']),
    ...perms('notifications', ['read', 'update']),
  ],
  ministry_leader: [
    ...perms('dashboard', ['read']),
    ...perms('organization', ['read']),
    ...perms('ministries', ['read', 'update']),
    ...perms('departments', ['read', 'update']),
    ...perms('teams', ['manage']),
    ...perms('organizationMembers', ['read', 'manage']),
    ...perms('leadership', ['read']),
    ...perms('members', ['read']),
    ...perms('events', ['manage']),
    ...perms('eventRegistrations', ['manage']),
    ...perms('attendance', ['manage']),
    ...perms('groups', ['manage']),
    ...perms('volunteers', ['manage']),
    ...perms('servingTeams', ['manage']),
    ...perms('schedules', ['manage']),
    ...perms('assignments', ['manage']),
    ...perms('documents', ['read']),
    ...perms('tasks', ['read', 'create', 'update']),
    ...perms('notifications', ['read', 'update']),
  ],
  church_admin: [
    ...perms('dashboard', ['read']),
    ...perms('organization', ['manage']),
    ...perms('ministries', ['manage']),
    ...perms('departments', ['manage']),
    ...perms('teams', ['manage']),
    ...perms('organizationMembers', ['manage']),
    ...perms('leadership', ['manage']),
    ...perms('members', ['manage']),
    ...perms('leaders', ['manage']),
    ...perms('events', ['manage']),
    ...perms('eventRegistrations', ['manage']),
    ...perms('attendance', ['manage']),
    ...perms('groups', ['manage']),
    ...perms('volunteers', ['manage']),
    ...perms('servingTeams', ['manage']),
    ...perms('schedules', ['manage']),
    ...perms('assignments', ['manage']),
    ...perms('documents', ['manage']),
    ...perms('tasks', ['manage']),
    ...perms('reports', ['read']),
    ...perms('notifications', ['manage']),
    ...perms('settings', ['manage']),
    ...perms('hrm', ['manage']),
    ...perms('registrations', ['manage']),
    ...perms('households', ['manage']),
    ...perms('transfers', ['manage']),
    ...perms('church', ['manage']),
    ...perms('users', ['manage']),
  ],
  church_pastor: [
    ...perms('dashboard', ['read']),
    ...perms('organization', ['manage']),
    ...perms('ministries', ['manage']),
    ...perms('departments', ['manage']),
    ...perms('teams', ['manage']),
    ...perms('organizationMembers', ['manage']),
    ...perms('leadership', ['manage']),
    ...perms('members', ['manage']),
    ...perms('leaders', ['manage']),
    ...perms('events', ['manage']),
    ...perms('eventRegistrations', ['manage']),
    ...perms('attendance', ['manage']),
    ...perms('documents', ['manage']),
    ...perms('tasks', ['manage']),
    ...perms('reports', ['read', 'manage']),
    ...perms('notifications', ['manage']),
    ...perms('settings', ['manage']),
    ...perms('hrm', ['manage']),
    ...perms('registrations', ['manage']),
    ...perms('households', ['manage']),
    ...perms('transfers', ['manage']),
    ...perms('church', ['manage']),
    ...perms('users', ['manage']),
  ],
  // Platform-wide administrator, spans every church. Assignment is
  // deliberately NOT self-servable anywhere in this codebase - see
  // firestore.rules, which never allows a client to write its own role as
  // super_admin.
  super_admin: allPermissions(),
};

/** `can(user, action, resource)` - the one function UI code should call to
 * decide whether to allow/hide an operation. Never hardcode a role check
 * (`user.role === 'church_admin'`) in a page/component; check the
 * permission the action actually requires instead. */
export function can(user: Pick<AuthUser, 'role' | 'accountStatus'> | null, action: PermissionAction, resource: PermissionResource): boolean {
  if (!user) return false;
  if (user.accountStatus !== 'active') return false;
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions?.includes(`${resource}.${action}` as Permission)
    || permissions?.includes(`${resource}.manage` as Permission)
    || false;
}
