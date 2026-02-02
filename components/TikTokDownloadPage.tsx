import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { LiquidGlassParams } from '../types';

const VIDEOS = [
  "https://res.cloudinary.com/dkjokhb4w/video/upload/v1770005519/TIKTOK_AU_GAMERS_1_cb5b7l.mp4",
  "https://res.cloudinary.com/dkjokhb4w/video/upload/v1769128347/ssstik.io__boilerroomtv_1769128318966_odpdxo.mp4",
  "https://res.cloudinary.com/dkjokhb4w/video/upload/v1769401959/TIKTOK_BRAZIL_TOURISTS_2_ze2vye.mp4"
];

// Create a loopable array (Set 1, Set 2 [Main], Set 3)
const LOOP_VIDEOS = [...VIDEOS, ...VIDEOS, ...VIDEOS];

type TikTokDownloadPageProps = {
  liquidGlassParams: LiquidGlassParams;
};

const TikTokDownloadPage: React.FC<TikTokDownloadPageProps> = ({ liquidGlassParams }) => {
  const [activeIndex, setActiveIndex] = useState(VIDEOS.length);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<number | null>(null);
  const isUserScrolling = useRef(false);
  const tintRgb = useMemo(() => {
    const hex = liquidGlassParams.tintHex.replace('#', '');
    const normalized = hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex.padEnd(6, '0');
    const r = parseInt(normalized.slice(0, 2), 16) || 255;
    const g = parseInt(normalized.slice(2, 4), 16) || 255;
    const b = parseInt(normalized.slice(4, 6), 16) || 255;
    return `${r} ${g} ${b}`;
  }, [liquidGlassParams.tintHex]);
  const glassOpacity = useMemo(
    () => liquidGlassParams.tintOpacity,
    [liquidGlassParams.tintOpacity]
  );


  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render once video is ready to ensure backdrop-filter samples correctly
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 100); // Small delay after mount
    return () => clearTimeout(timer);
  }, []);

  // Initialize videoRefs array size
  if (videoRefs.current.length !== LOOP_VIDEOS.length) {
    videoRefs.current = new Array(LOOP_VIDEOS.length).fill(null);
  }

  // Initial scroll to the middle set (Set 2)
  useEffect(() => {
    // Force initial scroll position immediately
    if (scrollContainerRef.current) {
       const container = scrollContainerRef.current;
       container.scrollTop = activeIndex * container.offsetHeight;
    }

    // Also ensure it's set after a tiny delay for reliable rendering
    const rafId = requestAnimationFrame(() => {
       if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = activeIndex * scrollContainerRef.current.offsetHeight;
       }
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Play/Pause management logic
  const playActiveVideos = useCallback(() => {
    // 1. Manage Main Feed Videos
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.muted = true;
          video.play().catch(err => {
            console.debug("Main video play blocked:", err);
          });
        } else {
          video.pause();
        }
      }
    });

    // 2. Manage Ambient Glow Video
    if (ambientVideoRef.current) {
      if (ambientVideoRef.current.src !== LOOP_VIDEOS[activeIndex]) {
        ambientVideoRef.current.src = LOOP_VIDEOS[activeIndex];
      }
      ambientVideoRef.current.muted = true;
      ambientVideoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  useEffect(() => {
    playActiveVideos();
  }, [playActiveVideos]);



  // Global interaction listener to "kickstart" videos
  useEffect(() => {
    const kickstart = () => {
      playActiveVideos();
    };
    window.addEventListener('touchstart', kickstart, { once: true });
    window.addEventListener('mousedown', kickstart, { once: true });
    window.addEventListener('scroll', kickstart, { once: true });
    return () => {
      window.removeEventListener('touchstart', kickstart);
      window.removeEventListener('mousedown', kickstart);
      window.removeEventListener('scroll', kickstart);
    };
  }, [playActiveVideos]);





  // Auto-advance logic
  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      
      timerRef.current = window.setTimeout(() => {
        if (scrollContainerRef.current && !isUserScrolling.current) {
          const container = scrollContainerRef.current;
          const nextIndex = activeIndex + 1;
          const targetY = nextIndex * container.offsetHeight;
          container.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 4000);
    };

    startTimer();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [activeIndex]);


  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollTop, offsetHeight } = container;
    
    // Avoid division by zero
    if (offsetHeight === 0) return;

    const index = Math.round(scrollTop / offsetHeight);
    
    if (index !== activeIndex && index >= 0 && index < LOOP_VIDEOS.length) {
      setActiveIndex(index);
    }

    // Seamless jumping for infinite loop
    if (scrollTop <= 0) {
      container.scrollTop = VIDEOS.length * offsetHeight;
    } 
    else if (scrollTop >= (LOOP_VIDEOS.length - 1) * offsetHeight) {
      container.scrollTop = (VIDEOS.length - 1) * offsetHeight;
    }
  };

  const handleTouchStart = () => {
    isUserScrolling.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  const handleTouchEnd = () => {
    isUserScrolling.current = false;
  };

  // Logo SVG Component
  const TikTokLogo = ({ className }: { className?: string }) => (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 88 31" fill="none">
        <g clipPath="url(#clip0_1931_20175)">
          <path d="M7.28896 12.4311V11.6053C7.00608 11.5675 6.71848 11.544 6.42145 11.544C2.8807 11.5392 0 14.4224 0 17.9708C0 20.1461 1.08439 22.0714 2.74397 23.2369C1.67373 22.0902 1.01838 20.5472 1.01838 18.8579C1.01838 15.3614 3.81893 12.5113 7.28896 12.4311Z" fill="#25F4EE"/>
          <path d="M7.44458 21.7931C9.02401 21.7931 10.3158 20.5332 10.3724 18.9666L10.3771 4.96622H12.9325C12.8807 4.67838 12.8524 4.3811 12.8524 4.0791H9.36347L9.35876 18.0795C9.30218 19.6461 8.01035 20.906 6.43091 20.906C5.94058 20.906 5.47854 20.7833 5.06836 20.5662C5.59641 21.3071 6.46392 21.7931 7.44458 21.7931Z" fill="#25F4EE"/>
          <path d="M17.7084 9.71797V8.93939C16.7325 8.93939 15.8273 8.65155 15.0635 8.15137C15.7424 8.92995 16.6618 9.49619 17.7084 9.71797Z" fill="#25F4EE"/>
          <path d="M15.0638 8.15094C14.3189 7.29685 13.871 6.18324 13.871 4.96582H12.9375C13.178 6.29649 13.97 7.43842 15.0638 8.15094Z" fill="#FE2C55"/>
          <path d="M6.42572 15.0315C4.80857 15.0315 3.49316 16.348 3.49316 17.9665C3.49316 19.0943 4.13437 20.0758 5.06788 20.5665C4.71899 20.0852 4.51154 19.4954 4.51154 18.8536C4.51154 17.2351 5.82695 15.9186 7.4441 15.9186C7.74584 15.9186 8.03816 15.9705 8.31161 16.0554V12.4881C8.02873 12.4504 7.74113 12.4268 7.4441 12.4268C7.39224 12.4268 7.34509 12.4315 7.29323 12.4315V15.1683C7.01506 15.0834 6.72746 15.0315 6.42572 15.0315Z" fill="#FE2C55"/>
          <path d="M17.7087 9.71777V12.431C15.8982 12.431 14.2198 11.8506 12.8525 10.8691V17.9708C12.8525 21.5145 9.97181 24.4023 6.42634 24.4023C5.05907 24.4023 3.78609 23.9682 2.74414 23.2368C3.91811 24.4967 5.59183 25.2895 7.44472 25.2895C10.9855 25.2895 13.8709 22.4063 13.8709 18.8579V11.7562C15.2382 12.7377 16.9166 13.3181 18.7271 13.3181V9.8263C18.3734 9.8263 18.034 9.78855 17.7087 9.71777Z" fill="#FE2C55"/>
          <path d="M12.8525 17.9705V10.8689C14.2198 11.8504 15.8982 12.4308 17.7087 12.4308V9.71754C16.662 9.49577 15.7426 8.92952 15.0637 8.15094C13.9699 7.43842 13.1825 6.29649 12.9327 4.96582H10.3773L10.3726 18.9662C10.316 20.5328 9.02415 21.7927 7.44472 21.7927C6.46406 21.7927 5.60127 21.3067 5.06379 20.5705C4.13027 20.0751 3.48907 19.0983 3.48907 17.9705C3.48907 16.352 4.80448 15.0355 6.42163 15.0355C6.72337 15.0355 7.01568 15.0874 7.28914 15.1724V12.4355C3.8191 12.511 1.01855 15.3611 1.01855 18.8577C1.01855 20.5469 1.6739 22.0852 2.74414 23.2366C3.7861 23.968 5.05907 24.4021 6.42634 24.4021C9.9671 24.4021 12.8525 21.5143 12.8525 17.9705Z" fill="#FAFAFA"/>
          <path d="M22.1777 9.72754H33.0829L32.0834 12.8513H29.2545V24.398H25.7279V12.8513L22.1824 12.856L22.1777 9.72754Z" fill="#FAFAFA"/>
          <path d="M50.9521 9.72754H62.1119L61.1124 12.8513H58.0337V24.398H54.5023V12.8513L50.9569 12.856L50.9521 9.72754Z" fill="#FAFAFA"/>
          <path d="M33.7529 14.3936H37.2465V24.3972H33.7718L33.7529 14.3936Z" fill="#FAFAFA"/>
          <path d="M38.6375 9.68945H42.1311V16.5221L45.5917 13.1199H49.7596L45.3796 17.3715L50.2829 24.3976H46.4357L43.1637 19.5279L42.1264 20.533V24.3976H38.6328V9.68945H38.6375Z" fill="#FAFAFA"/>
          <path d="M75.6475 9.68945H79.1411V16.5221L82.6017 13.1199H86.7695L82.3895 17.3715L87.2928 24.3976H83.4503L80.1783 19.5279L79.1411 20.533V24.3976H75.6475V9.68945Z" fill="#FAFAFA"/>
          <path d="M35.4969 13.2516C36.4681 13.2516 37.2555 12.4636 37.2555 11.4915C37.2555 10.5195 36.4681 9.73145 35.4969 9.73145C34.5256 9.73145 33.7383 10.5195 33.7383 11.4915C33.7383 12.4636 34.5256 13.2516 35.4969 13.2516Z" fill="#FAFAFA"/>
          <path d="M61.6639 18.4099C61.6639 15.2625 64.092 12.6814 67.1801 12.4407C67.0246 12.4266 66.8124 12.4219 66.6568 12.4219C63.3518 12.4219 60.6738 15.1021 60.6738 18.4099C60.6738 21.7177 63.3518 24.3979 66.6568 24.3979C66.8124 24.3979 67.0246 24.3885 67.1801 24.379C64.0967 24.1384 61.6639 21.5573 61.6639 18.4099Z" fill="#25F4EE"/>
          <path d="M68.5378 12.4219C68.3775 12.4219 68.1654 12.4313 68.0098 12.4407C71.0932 12.6814 73.5213 15.2625 73.5213 18.4099C73.5213 21.5573 71.0932 24.1384 68.0098 24.379C68.1654 24.3932 68.3775 24.3979 68.5378 24.3979C71.8428 24.3979 74.5208 21.7177 74.5208 18.4099C74.5208 15.1021 71.8428 12.4219 68.5378 12.4219Z" fill="#FE2C55"/>
          <path d="M67.5953 21.3213C65.9876 21.3213 64.6863 20.019 64.6863 18.4099C64.6863 16.8008 65.9876 15.4985 67.5953 15.4985C69.203 15.4985 70.5043 16.8008 70.5043 18.4099C70.5043 20.019 69.1983 21.3213 67.5953 21.3213ZM67.5953 12.4219C64.2903 12.4219 61.6123 15.1021 61.6123 18.4099C61.6123 21.7177 64.2903 24.3979 67.5953 24.3979C70.9003 24.3979 73.5783 18.4099 73.5783 18.4099C73.5783 15.1021 70.9003 12.4219 67.5953 12.4219Z" fill="#FAFAFA"/>
        </g>
        <defs>
          <clipPath id="clip0_1931_20175">
            <rect width="87.0952" height="31" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col bg-black text-white relative font-sans w-full h-full overflow-hidden select-none">
      
      <header className="pt-4 pl-4 z-30 shrink-0 absolute top-0 left-0 slide-up-in" style={{ animationDelay: '2.1s' }}>
        <div className="w-[87.095px] h-[31px]">
          <TikTokLogo className="w-full h-full" />
        </div>
      </header>

      {/* Headline */}
      <div className="pl-4 mt-[64px] z-20 shrink-0 slide-up-in" style={{ animationDelay: '1.9s' }}>
        <h1 
          className="tracking-tight text-[#F6F6F6]" 
          style={{ 
            fontSize: '40px', 
            fontWeight: 600, 
            lineHeight: '1.2',
            fontFamily: '"Inter", "TikTok Sans", sans-serif'
          }}
        >
          Download TikTok<br />
          Make your day
        </h1>
      </div>

      {/* Hero Content Section */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-start pb-8">
        
        {/* Ambient Video Glow - Subtle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 video-card-ambient" style={{ animationDelay: '1s' }}>
          <div className="relative w-[80%] aspect-[49/106] scale-125">
              <video 
                ref={ambientVideoRef}
                className="w-full h-full object-cover blur-[60px] saturate-[1.5] opacity-[0.5]"
                style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)' }}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
          </div>
        </div>
        
        <div 
          className="relative shadow-[0_40px_100px_rgba(0,0,0,0.95)] z-10 bg-zinc-900 group shrink-0 video-card-shrink"
          style={{ width: "80%", aspectRatio: "49/106", overflow: "hidden", transformOrigin: "center top" }}
        >
          <img 
            src="https://res.cloudinary.com/dkjokhb4w/image/upload/v1770006552/Top_tab_navigation_n9q5gp.png"
            className="absolute top-[22px] left-0 w-full z-40 pointer-events-none"
            style={{ aspectRatio: '195/22' }}
            alt="Top tab navigation"
          />

          {/* Scrollable Video Feed */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {LOOP_VIDEOS.map((src, i) => (
              <div key={i} className="w-full h-full snap-start relative flex-shrink-0">
                <video 
                  /* Fixed: Ensure ref callback returns void to avoid TypeScript error */
                  ref={el => { videoRefs.current[i] = el; }}
                  src={src} 
                  className="w-full h-full object-cover brightness-[0.85]"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onCanPlay={() => {
                    if (i === activeIndex) videoRefs.current[i]?.play();
                  }}
                />
                <img 
                  src="https://res.cloudinary.com/dkjokhb4w/image/upload/v1770006552/Interaction_buttons_qs4eq5.png"
                  className="absolute right-0 bottom-[96px] z-40 pointer-events-none"
                  style={{ width: '15%', aspectRatio: '5/32' }}
                  alt="Interaction buttons"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="slide-up-in" style={{ position: 'absolute', left: 16, right: 16, bottom: 8, zIndex: 60, pointerEvents: 'none', animationDelay: '1.6s' }}>
        <div 
          className="relative rounded-[32px] pointer-events-auto overflow-hidden p-[18px]"
          style={{
            background: `rgba(${tintRgb} / ${glassOpacity})`,
            backdropFilter: `blur(${liquidGlassParams.blur}px) saturate(1.6)`, // Removed saturate(16) which was too high
            WebkitBackdropFilter: `blur(${liquidGlassParams.blur}px) saturate(1.6)`,
            // willChange: 'backdrop-filter', // Removed as it might cause caching issues
            transform: 'translate3d(0,0,0)', // Keep hardware acceleration
            border: `1px solid rgba(${tintRgb} / 0.2)`,
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.37),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 0 12px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 rounded-[32px]"
              style={{
                // background: `radial-gradient(120% 100% at 10% 0%, rgba(255,255,255,${liquidGlassParams.highlightOpacity}) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 100%)`
              }}
            />
            <div
              className="absolute inset-0 rounded-[32px]"
              style={{
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 ${liquidGlassParams.innerShadowSpread}px ${liquidGlassParams.innerShadowBlur}px rgba(0,0,0,0.35)`
              }}
            />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-[64px] h-[64px] bg-black rounded-2xl flex items-center justify-center p-3 shadow-xl border border-white/5 shrink-0 overflow-hidden">
               <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.589 6.686a4.94 4.94 0 0 1-3.778-3.633V2h-3.445v13.674a2.896 2.896 0 1 1-2.896-2.896 2.854 2.854 0 0 1 .593.067V9.382a6.329 6.329 0 1 0 5.753 6.292V8.848c1.283.959 2.856 1.493 4.773 1.493V6.891a4.833 4.833 0 0 1-1.002-.205Z" fill="#25F4EE" />
                <path d="M19.589 6.686a4.94 4.94 0 0 1-3.778-3.633V2h-3.445v13.674a2.896 2.896 0 1 1-2.896-2.896 2.854 2.854 0 0 1 .593.067V9.382a6.329 6.329 0 1 0 5.753 6.292V8.848c1.283.959 2.856 1.493 4.773 1.493V6.891a4.833 4.833 0 0 1-1.002-.205Z" fill="#FE2C55" className="mix-blend-screen translate-x-[1.5px] translate-y-[1.5px]" />
                <path d="M19.589 6.686a4.94 4.94 0 0 1-3.778-3.633V2h-3.445v13.674a2.896 2.896 0 1 1-2.896-2.896 2.854 2.854 0 0 1 .593.067V9.382a6.329 6.329 0 1 0 5.753 6.292V8.848c1.283.959 2.856 1.493 4.773 1.493V6.891a4.833 4.833 0 0 1-1.002-.205Z" fill="white" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-[18px] leading-tight text-white tracking-tight">TikTok: Videos, Lives & Musics</h3>
              <p className="text-white/60 text-[13px] mt-1 font-medium">Global video community</p>
            </div>
          </div>
          
          <button className="w-full bg-[#FE2C55] hover:brightness-110 active:scale-[0.98] transition-all py-4 rounded-full flex items-center justify-center gap-2 font-bold text-[18px] shadow-lg shadow-[#FE2C55]/30 group/btn">
            <span>Download TikTok App</span>
            <div className="bg-white rounded-full p-1 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
              <ArrowRight size={16} className="text-[#FE2C55]" strokeWidth={4} />
            </div>
          </button>
        </div>
      </div>

      {/* Footer (Safe Area Indicator) */}
     

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .slide-up-in {
          opacity: 0;
          transform: translateY(24px);
          animation: slideUpIn 0.6s ease-in-out forwards;
        }
        @keyframes slideUpIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .video-card-shrink {
          transform: translateY(-160px) scale(1.25);
          border-radius: 0;
          box-shadow: none; /* 初始无阴影 */
          animation: videoCardShrink 0.6s ease-in-out 1s forwards;
        }
        .video-card-ambient {
          animation: ambientFadeIn 1s ease-in-out 1s forwards;
        }
        @keyframes ambientFadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes videoCardShrink {
          from {
            transform: translateY(-160px) scale(1.25);
            border-radius: 0;
            box-shadow: none;
          }
          to {
            transform: translateY(40px) scale(1);
            border-radius: 36px;
            box-shadow: 0 40px 100px rgba(0,0,0,0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default TikTokDownloadPage;
