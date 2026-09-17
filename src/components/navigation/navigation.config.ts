export type ShellIconName =
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
  | 'settings'
  | 'profile'
  | 'logout';

export type NavigationSectionId =
  | 'main'
  | 'churchManagement'
  | 'operations'
  | 'system'
  | 'profile';

export type NavigationItem = {
  id: string;
  labelKey: string;
  route: string;
  icon: ShellIconName;
  section: NavigationSectionId;
  badge?: number;
  permission?: string;
  mobileVisibility?: boolean;
  desktopVisibility?: boolean;
};

export const navigationItems: NavigationItem[] = [
  // MAIN
  {
    id: 'dashboard',
    labelKey: 'navigation.dashboard',
    route: '/dashboard',
    icon: 'dashboard',
    section: 'main',
    mobileVisibility: true,
    desktopVisibility: true,
  },

  // CHURCH MANAGEMENT
  {
    id: 'ministries',
    labelKey: 'navigation.ministries',
    route: '/ministries',
    icon: 'ministries',
    section: 'churchManagement',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'departments',
    labelKey: 'navigation.departments',
    route: '/departments',
    icon: 'departments',
    section: 'churchManagement',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'members',
    labelKey: 'navigation.members',
    route: '/members',
    icon: 'members',
    section: 'churchManagement',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'leaders',
    labelKey: 'navigation.leaders',
    route: '/leaders',
    icon: 'leaders',
    section: 'churchManagement',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'hrm',
    labelKey: 'navigation.hrm',
    route: '/hrm',
    icon: 'members', // reuse members icon
    section: 'churchManagement',
    permission: 'hrm.manage', // Requires hrm manage permission
    mobileVisibility: true,
    desktopVisibility: true,
  },

  // OPERATIONS
  {
    id: 'events',
    labelKey: 'navigation.events',
    route: '/events',
    icon: 'events',
    section: 'operations',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'tasks',
    labelKey: 'navigation.tasks',
    route: '/tasks',
    icon: 'tasks',
    section: 'operations',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'documents',
    labelKey: 'navigation.documents',
    route: '/documents',
    icon: 'documents',
    section: 'operations',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'reports',
    labelKey: 'navigation.reports',
    route: '/reports',
    icon: 'reports',
    section: 'operations',
    mobileVisibility: true,
    desktopVisibility: true,
  },
  {
    id: 'notifications',
    labelKey: 'navigation.notifications',
    route: '/notifications',
    icon: 'notifications',
    section: 'operations',
    mobileVisibility: true,
    desktopVisibility: true,
  },

  // SYSTEM
  {
    id: 'settings',
    labelKey: 'navigation.settings',
    route: '/settings',
    icon: 'settings',
    section: 'system',
    mobileVisibility: true,
    desktopVisibility: true,
  },

  // PROFILE
  {
    id: 'profile',
    labelKey: 'navigation.profile',
    route: '/profile',
    icon: 'profile',
    section: 'profile',
    mobileVisibility: true,
    desktopVisibility: true,
  },
];

export const navigationSections: { id: NavigationSectionId; labelKey: string }[] = [
  {
    id: 'main',
    labelKey: 'navigation.sections.main',
  },
  {
    id: 'churchManagement',
    labelKey: 'navigation.sections.churchManagement',
  },
  {
    id: 'operations',
    labelKey: 'navigation.sections.operations',
  },
  {
    id: 'system',
    labelKey: 'navigation.sections.system',
  },
  {
    id: 'profile',
    labelKey: 'navigation.sections.profile',
  },
];