import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ShellIcon } from './ShellIcon';

type NotificationButtonProps = {
  unreadCount?: number;
};

export function NotificationButton({
  unreadCount = 0,
}: NotificationButtonProps) {
  const { t } = useTranslation();

  return (
    <Link
      to="/notifications"
      aria-label={t('navigation.notifications')}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7E6F7] bg-surface/75 text-[var(--color-text)] shadow-sm backdrop-blur transition hover:border-[#AFCBEB] hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[#1458B8]/30"
    >
      <ShellIcon name="notifications" width={18} height={18} />

      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#1458B8] px-1 text-[9px] font-bold text-white ring-2 ring-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
