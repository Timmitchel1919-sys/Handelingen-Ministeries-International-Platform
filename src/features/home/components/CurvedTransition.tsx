export function CurvedTransition() {
  return (
    <div
      aria-hidden="true"
      className="relative -mb-px h-24 overflow-hidden bg-transparent"
    >
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 48C280 112 470 112 720 60C970 8 1160 8 1440 58V120H0V48Z"
          fill="var(--color-background)"
        />

        <path
          d="M0 48C280 112 470 112 720 60C970 8 1160 8 1440 58"
          stroke="rgba(63,169,245,0.65)"
          strokeWidth="3"
        />

        <path
          d="M0 43C280 107 470 107 720 55C970 3 1160 3 1440 53"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
}