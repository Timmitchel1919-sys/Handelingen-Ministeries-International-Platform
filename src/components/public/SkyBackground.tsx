import { useRef, type ReactNode } from 'react';
import { ReactiveCloudLight } from './ReactiveCloudLight';

interface SkyBackgroundProps {
  children: ReactNode;
  dove?: ReactNode;
}

export function SkyBackground({
  children,
  dove,
}: SkyBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ background: 'var(--sky-background)' }}>
      {/* Interactive Cloud Light Layer */}
      <ReactiveCloudLight containerRef={containerRef} />
      


      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-128 w-lg rounded-full bg-white/25 blur-[90px] dark:opacity-10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-48 h-144 w-xl rounded-full bg-[#1458B8]/25 blur-[100px] dark:opacity-10"
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
        className="pointer-events-none absolute left-[8%] top-[12%] h-24 w-52 rounded-full bg-white/55 blur-2xl dark:opacity-10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[28%] h-28 w-64 rounded-full bg-white/45 blur-3xl dark:opacity-10"
      />

      {dove}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
