import type { ReactNode } from 'react';

interface SkyBackgroundProps {
  children: ReactNode;
  dove?: ReactNode;
}

export function SkyBackground({
  children,
  dove,
}: SkyBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--sky-background)' }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.85),transparent_35%)] dark:hidden"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-128 w-lg rounded-full bg-white/25 blur-[90px] dark:hidden"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-48 h-144 w-xl rounded-full bg-[#1458B8]/25 blur-[100px] dark:hidden"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'url("/world-map.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[12%] h-24 w-52 rounded-full bg-white/55 blur-2xl dark:hidden"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[28%] h-28 w-64 rounded-full bg-white/45 blur-3xl dark:hidden"
      />

      {dove}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
