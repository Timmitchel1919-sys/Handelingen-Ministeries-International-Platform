import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { appConfig } from '@/app/config/app.config';

const SPLASH_DURATION = 15000;

export function BrandedSplashScreen() {
  const { t } = useTranslation();
  
  const [shouldShow] = useState(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      sessionStorage.setItem('hasSeenSplash', 'true');
      return true;
    }
    return false;
  });

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'holding' | 'fading' | 'done'>('loading');

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldShow) {
      setPhase('done');
      return;
    }
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      const currentProgress = Math.min(100, (elapsed / SPLASH_DURATION) * 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('holding');
        setTimeout(() => setPhase('fading'), 300);
        setTimeout(() => setPhase('done'), 800); // 300ms hold + 500ms fade
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#091c33' }}
    >
      {/* Background - deep blue atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e3a6a] via-[#091c33] to-[#040e1a]" />
      
      {/* Sunlight glow top center */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25)_0%,rgba(63,169,245,0.1)_40%,transparent_70%)] blur-[60px]" />
      
      {/* Subtle World Map Background */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage: 'url("/world-map.svg")',
          backgroundSize: '120% auto'
        }}
      />
      
      {/* Global Horizon Curve at Bottom */}
      <div className="absolute -bottom-64 left-1/2 h-[500px] w-[150%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_top,rgba(63,169,245,0.15)_0%,transparent_60%)] blur-2xl" />
      <div className="absolute -bottom-[800px] left-1/2 h-[1000px] w-[200%] -translate-x-1/2 rounded-[100%] border-t border-white/5 bg-[#040e1a] shadow-[0_-20px_60px_rgba(63,169,245,0.1)]" />

      {/* Clouds framing */}
      <div className="absolute -left-32 -top-20 h-[500px] w-[500px] rounded-full bg-white/5 blur-[100px]" />
      <div className="absolute -right-32 top-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-[120px]" />
      <div className="absolute bottom-10 left-1/4 h-[400px] w-[600px] rounded-full bg-[#1458b8]/10 blur-[100px]" />

      {/* Network Lines */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 200 600 Q 400 400 500 300 T 800 200" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M 100 400 Q 300 500 500 300 T 900 500" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="200" cy="600" r="2" fill="white" className="drop-shadow-[0_0_4px_white]" />
        <circle cx="500" cy="300" r="3" fill="white" className="drop-shadow-[0_0_6px_white]" />
        <circle cx="800" cy="200" r="2" fill="white" className="drop-shadow-[0_0_4px_white]" />
        <circle cx="100" cy="400" r="1.5" fill="white" className="drop-shadow-[0_0_3px_white]" />
        <circle cx="900" cy="500" r="2.5" fill="white" className="drop-shadow-[0_0_5px_white]" />
      </svg>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-1000 motion-reduce:animate-none">
        
        {/* Logo */}
        <img
          src={appConfig.logoUrl}
          alt={t('appName')}
          className="mb-8 w-28 drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] sm:w-40 md:w-48 lg:w-56"
          style={{ objectFit: 'contain' }}
        />

        {/* Title */}
        <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-[#173B70] sm:text-4xl md:text-5xl" style={{ color: '#ffffff' }}>
          Handelingen Ministries
        </h1>
        
        {/* Subtitle */}
        <div className="mb-6 flex items-center justify-center gap-4 w-full">
          <div className="h-px w-12 bg-[#3FA9F5]/40 sm:w-20" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#3FA9F5] sm:text-base">
            International
          </h2>
          <div className="h-px w-12 bg-[#3FA9F5]/40 sm:w-20" />
        </div>

        {/* Tagline */}
        <p className="mb-14 text-lg font-medium text-white/90 sm:text-xl">
          {t('public.landing.tagline')}
        </p>

        {/* Progress Section */}
        <div className="w-full max-w-[420px] sm:max-w-md md:max-w-xl">
          
          <div className="flex items-center gap-4">
            {/* Glossy Loading Bar */}
            <div 
              className="relative h-5 flex-1 overflow-hidden rounded-full border border-white/20 bg-black/20 p-0.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3),0_0_15px_rgba(63,169,245,0.1)] backdrop-blur-md sm:h-6"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              {/* Fill */}
              <div 
                className="relative h-full rounded-full bg-gradient-to-r from-[#1458B8] via-[#20C8FF] to-[#8BE8FF] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              >
                {/* Top Gloss */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
                {/* Leading Edge Glow */}
                <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-r from-transparent to-white/60 blur-[2px]" />
              </div>
            </div>

            {/* Percentage */}
            <div className="w-12 text-right text-lg font-bold text-white shadow-black drop-shadow-md sm:text-xl">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Loading Message */}
          <div className="mt-4 text-xs font-semibold tracking-widest text-[#3FA9F5]/80 sm:text-sm">
            {t('splash.loading')}
          </div>
        </div>
      </div>

      {/* Footer Brand Statement */}
      <div className="absolute bottom-6 w-full text-center px-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white/40 sm:text-xs">
          {t('splash.footer')}
        </p>
      </div>
    </div>
  );
}
