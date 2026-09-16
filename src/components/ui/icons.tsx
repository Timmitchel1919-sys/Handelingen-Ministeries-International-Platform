import type { SVGProps } from 'react';

export type IconName =
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
  | 'menu'
  | 'close'
  | 'search'
  | 'bell'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'user'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'globe'
  | 'alert-triangle'
  | 'inbox'
  | 'more-horizontal'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'heart'
  | 'book'
  | 'play'
  | 'arrow-right'
  | 'check';

const paths: Record<IconName, string> = {
  dashboard: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
  ministries: 'M12 3 2 9l10 6 10-6-10-6Zm0 6v12M2 15l10 6 10-6',
  departments: 'M4 21V8a1 1 0 0 1 1-1h5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h5a1 1 0 0 1 1 1v13H4Zm4-3h2m4 0h2m-8-4h2m4 0h2',
  members: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75',
  leaders: 'M12 2 9 8l-6 1 4.5 4.5L6 20l6-3.2L18 20l-1.5-6.5L21 9l-6-1-3-6Z',
  events: 'M8 2v4M16 2v4M3 9h18M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  documents: 'M14 2H6a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-6-6ZM14 2v6h6M9 13h6m-6 4h6',
  tasks: 'm4 7 2 2 3-3M4 15l2 2 3-3M11 8h9M11 16h9',
  reports: 'M4 21V3m0 18h16M8 17V9m5 8v-5m5 5V6',
  notifications: 'M6 8a6 6 0 1 1 12 0c0 6 2 8 2 8H4s2-2 2-8Zm4.5 11a1.5 1.5 0 0 0 3 0',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5c0 .4 0 .8-.1 1.2l2 1.6-2 3.4-2.3-1a7.4 7.4 0 0 1-2 1.2l-.4 2.6H9.4l-.4-2.6a7.4 7.4 0 0 1-2-1.2l-2.3 1-2-3.4 2-1.6c-.1-.4-.1-.8-.1-1.2s0-.8.1-1.2l-2-1.6 2-3.4 2.3 1c.6-.5 1.3-.9 2-1.2l.4-2.6h5.2l.4 2.6c.7.3 1.4.7 2 1.2l2.3-1 2 3.4-2 1.6c.1.4.1.8.1 1.2Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M18 6 6 18',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  bell: 'M6 8a6 6 0 1 1 12 0c0 6 2 8 2 8H4s2-2 2-8Zm4.5 11a1.5 1.5 0 0 0 3 0',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m14.14 6.14 1.42 1.42M4.44 4.44l1.42 1.42m0 12.28-1.42 1.42M19.56 4.44l-1.42 1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z',
  monitor: 'M4 4h16v11H4V4Zm5 15h6M9 15v4m6-4v4',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'chevron-left': 'm15 18-6-6 6-6',
  'chevron-right': 'm9 18 6-6-6-6',
  'chevron-down': 'm6 9 6 6 6-6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18Z',
  'alert-triangle': 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4h.01',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z',
  'more-horizontal': 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',

  mail: 'M4 4h16v16H4V4Zm0 1 8 7 8-7',
  lock: 'M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'eye-off': 'm3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.3A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-3 4.2M6.2 6.2C3.5 8.1 2 12 2 12s3.5 8 10 8a10 10 0 0 0 4.2-.9',
  heart: 'M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z',
  book: 'M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 0-2 2V5Zm16 0a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 1 2 2V5Z',
  play: 'm9 6 10 6-10 6V6Z',
  'arrow-right': 'M5 12h14m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}