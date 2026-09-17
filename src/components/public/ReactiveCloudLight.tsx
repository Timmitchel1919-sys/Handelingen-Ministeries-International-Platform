import { useEffect, useRef } from 'react';

interface ReactiveCloudLightProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function ReactiveCloudLight({ containerRef }: ReactiveCloudLightProps) {
  const primaryRef = useRef<HTMLDivElement>(null);
  const lobeARef = useRef<HTMLDivElement>(null);
  const lobeBRef = useRef<HTMLDivElement>(null);
  const lobeCRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number | null>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      let nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      let ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Adjust movement scale based on screen size (desktop 100%, mobile ~50-60%)
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.6 : 1;

      // Max displacement (±30% horiz, ±20% vert)
      const maxDx = rect.width * 0.3 * scale;
      const maxDy = rect.height * 0.2 * scale;

      nx = Math.max(-1, Math.min(1, nx));
      ny = Math.max(-1, Math.min(1, ny));

      targetX.current = nx * maxDx;
      targetY.current = ny * maxDy;
    };

    const handlePointerLeave = () => {
      targetX.current = 0;
      targetY.current = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handlePointerMove as EventListener);
      container.addEventListener('pointerleave', handlePointerLeave as EventListener);
    }

    const animate = () => {
      const smoothing = 0.05;
      currentX.current += (targetX.current - currentX.current) * smoothing;
      currentY.current += (targetY.current - currentY.current) * smoothing;

      if (primaryRef.current) {
        primaryRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;
      }
      if (lobeARef.current) {
        lobeARef.current.style.transform = `translate3d(${currentX.current * 0.85}px, ${currentY.current * 0.85}px, 0)`;
      }
      if (lobeBRef.current) {
        lobeBRef.current.style.transform = `translate3d(${currentX.current * 0.65}px, ${currentY.current * 0.65}px, 0)`;
      }
      if (lobeCRef.current) {
        lobeCRef.current.style.transform = `translate3d(${currentX.current * 0.45}px, ${currentY.current * 0.45}px, 0)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${currentX.current * 0.95}px, ${currentY.current * 0.95}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener('pointermove', handlePointerMove as EventListener);
        container.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden dark:opacity-80">
      <div className="absolute left-1/2 top-[15%] -translate-x-[45%] md:-translate-x-1/2 sm:top-[20%] md:top-[25%] lg:top-[30%]">
        
        {/* Primary Cloud */}
        <div 
          ref={primaryRef}
          className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45),rgba(220,238,250,0.20),rgba(180,210,230,0.08),transparent_70%)] blur-[40px] will-change-transform dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),rgba(100,180,240,0.15),rgba(50,120,200,0.05),transparent_70%)] sm:h-[550px] sm:w-[850px] md:h-[650px] md:w-[950px]"
        />
        
        {/* Lobe A */}
        <div 
          ref={lobeARef}
          className="absolute left-1/2 top-1/2 h-[400px] w-[500px] -translate-x-[70%] -translate-y-[45%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_70%)] blur-[45px] will-change-transform dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)] sm:h-[450px] sm:w-[600px]"
        />
        
        {/* Lobe B */}
        <div 
          ref={lobeBRef}
          className="absolute left-1/2 top-1/2 h-[350px] w-[600px] -translate-x-[35%] -translate-y-[65%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(220,238,250,0.2),transparent_70%)] blur-[55px] will-change-transform dark:bg-[radial-gradient(ellipse_at_center,rgba(150,200,240,0.12),transparent_70%)] sm:h-[400px] sm:w-[700px]"
        />
        
        {/* Lobe C */}
        <div 
          ref={lobeCRef}
          className="absolute left-1/2 top-1/2 h-[300px] w-[450px] -translate-x-[30%] -translate-y-[20%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(180,210,230,0.15),transparent_70%)] blur-[40px] will-change-transform dark:bg-[radial-gradient(ellipse_at_center,rgba(100,160,220,0.1),transparent_70%)] sm:h-[350px] sm:w-[500px]"
        />
        
        {/* Core Heavenly Light */}
        <div 
          ref={coreRef}
          className="absolute left-1/2 top-1/2 h-[250px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)] blur-[30px] will-change-transform dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35),transparent_60%)] sm:h-[300px] sm:w-[400px]"
        />
      </div>
    </div>
  );
}

