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
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #87CEF5 0%, #63B8EE 20%, #4FA9E8 40%, #1676D2 80%, #052F5D 100%)',
      }}
    >
      {/* Volumetric sunlight & haze */}
      <div className="absolute top-[-20%] left-1/2 w-[150vw] h-[80vh] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,1)_0%,rgba(217,242,255,0.8)_20%,rgba(184,228,250,0)_60%)] mix-blend-screen pointer-events-none" />
      
      {/* Light rays */}
      <div 
        className="absolute top-0 left-1/2 w-[200vw] h-screen -translate-x-1/2 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 40deg, rgba(255,255,255,0.8) 70deg, transparent 90deg, rgba(255,255,255,0.6) 110deg, transparent 150deg, rgba(255,255,255,0.5) 210deg, transparent 250deg, rgba(255,255,255,0.8) 290deg, transparent 320deg)',
          filter: 'blur(30px)'
        }}
      />

      {/* World Map */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-[0.15] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: 'url("/world-map.svg")',
          backgroundSize: '110% auto',
          backgroundPosition: 'center 20%'
        }}
      />

      {/* Network Connections */}
      <svg className="absolute inset-0 h-full w-full opacity-40 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 150 350 Q 350 250 500 300 T 850 250" stroke="rgba(255,255,255,0.6)" strokeWidth="1" className="mix-blend-screen" />
        <path d="M 200 450 Q 400 350 500 300 T 750 400" stroke="rgba(63,169,245,0.6)" strokeWidth="1.5" className="mix-blend-screen" />
        <path d="M 300 200 Q 450 300 500 300 T 700 200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" className="mix-blend-screen" />
        <circle cx="150" cy="350" r="2" fill="white" className="drop-shadow-[0_0_8px_cyan]" />
        <circle cx="500" cy="300" r="3" fill="white" className="drop-shadow-[0_0_12px_cyan]" />
        <circle cx="850" cy="250" r="2" fill="white" className="drop-shadow-[0_0_8px_cyan]" />
        <circle cx="200" cy="450" r="1.5" fill="#3FA9F5" className="drop-shadow-[0_0_6px_white]" />
        <circle cx="750" cy="400" r="1.5" fill="#3FA9F5" className="drop-shadow-[0_0_6px_white]" />
        <circle cx="300" cy="200" r="2" fill="white" className="drop-shadow-[0_0_6px_cyan]" />
        <circle cx="700" cy="200" r="2" fill="white" className="drop-shadow-[0_0_6px_cyan]" />
      </svg>

      {/* Cloud framing (CSS approximations, heavily blurred blobs) */}
      {/* Top Left */}
      <div className="absolute left-[-10%] top-[-10%] h-[60vh] w-[40vw] rounded-full bg-white/70 blur-[80px] pointer-events-none mix-blend-screen" />
      {/* Top Right */}
      <div className="absolute right-[-10%] top-[-10%] h-[60vh] w-[40vw] rounded-full bg-white/70 blur-[80px] pointer-events-none mix-blend-screen" />
      {/* Bottom Left */}
      <div className="absolute left-[-5%] bottom-[10%] h-[50vh] w-[35vw] rounded-full bg-white/60 blur-[70px] pointer-events-none mix-blend-screen" />
      {/* Bottom Right */}
      <div className="absolute right-[-5%] bottom-[10%] h-[50vh] w-[35vw] rounded-full bg-white/60 blur-[70px] pointer-events-none mix-blend-screen" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center animate-in fade-in zoom-in-[0.98] duration-1000 mt-[10vh]">
        
        {/* Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-125" />
          <img
            src={appConfig.logoUrl}
            alt={t('appName')}
            className="relative w-48 sm:w-56 md:w-64 lg:w-72 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Brand Name */}
        <h1 className="mb-2 text-4xl sm:text-5xl md:text-6xl font-bold text-[#082D64] tracking-tight drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>
          Handelingen Ministries
        </h1>
        
        {/* INTERNATIONAL */}
        <div className="mb-4 flex items-center justify-center gap-4 w-full">
          <div className="h-0.5 w-12 bg-[#20AEEF] sm:w-24 md:w-32" />
          <h2 className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-[#20AEEF] whitespace-nowrap">
            INTERNATIONAL
          </h2>
          <div className="h-0.5 w-12 bg-[#20AEEF] sm:w-24 md:w-32" />
        </div>

        {/* Tagline */}
        <p className="mb-12 text-xl sm:text-2xl md:text-3xl text-[#0A3B78] font-medium drop-shadow-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
          {t('public.landing.tagline', { defaultValue: 'Zie alleen op Jezus' })}
        </p>

        {/* Loading Section */}
        <div className="w-full max-w-70 sm:max-w-100 md:max-w-125 flex flex-col items-center gap-4 mt-8">
          
          <div className="flex items-center gap-4 w-full">
            {/* Pill Bar */}
            <div 
              className="relative h-4 sm:h-5 flex-1 overflow-hidden rounded-full border border-white/60 bg-blue-900/20 shadow-[0_0_15px_rgba(63,169,245,0.4)] backdrop-blur-md"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              {/* Fill */}
              <div 
                className="relative h-full rounded-full bg-linear-to-r from-[#1458B8] via-[#20AEEF] to-[#72D5FF] transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
              >
                {/* Top Gloss */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/70 to-transparent rounded-t-full" />
                {/* Leading Edge Glow */}
                <div className="absolute right-0 top-0 h-full w-6 bg-linear-to-l from-white to-transparent blur-[2px]" />
              </div>
            </div>

            {/* Percentage */}
            <div className="w-12 text-right text-base sm:text-lg font-bold text-[#D9F2FF] drop-shadow-md">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-white/90 drop-shadow-md uppercase">
            {t('public.splash.loading', { defaultValue: 'LOADING A BRIGHTER TOMORROW...' })}
          </div>
        </div>
      </div>

      {/* Earth Horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-[25vh] pointer-events-none">
        <div className="absolute top-0 left-1/2 h-125 w-[150%] -translate-x-1/2 rounded-[100%] border-t border-cyan-200/50 bg-linear-to-b from-[#064C88] to-[#052F5D] shadow-[0_-15px_50px_rgba(63,169,245,0.6)]" />
        <div className="absolute top-0 left-1/2 h-25 w-[150%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4)_0%,rgba(63,169,245,0.2)_40%,transparent_70%)] blur-xl mix-blend-screen" />
      </div>

      {/* Footer Brand Statement */}
      <div className="absolute bottom-8 w-full text-center px-4 z-20">
        <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/70 uppercase drop-shadow-md">
          {t('public.splash.footer', { defaultValue: 'PEOPLE | CHURCHES | COMMUNITIES | FOR HIS KINGDOM' })}
        </p>
      </div>
    </div>
  );
}
