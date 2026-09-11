import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  name: string;
  size?: number;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

export function Avatar({ className, src, name, size = 36, ...props }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-dark)] font-medium text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <>
          <span aria-hidden="true">{initialsFrom(name)}</span>
          <span className="sr-only">{name}</span>
        </>
      )}
    </span>
  );
}
