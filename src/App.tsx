import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Music, VolumeX, Sparkles, Settings, X, RefreshCw, Compass, Home, Plane, ChevronLeft, ChevronRight, Check } from 'lucide-react';

import { AppSettings, TimelineItem, GalleryItem, FunnyCard, BucketListItem } from './types';

// Load default JSON structures
import defaultSettings from './data/settings.json';
import timelineData from './data/timeline.json';
import galleryData from './data/gallery.json';
import funnyData from './data/funny.json';
import futureData from './data/future.json';
import letterData from './data/letter.json';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Future sequenced animation stages
  const [futureStage, setFutureStage] = useState<'jokes' | 'glitching' | 'revealed'>('jokes');

  // Input bindings for setting custom names/date
  const [inputNames, setInputNames] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputMusic, setInputMusic] = useState('');

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Swipe detection coordinates
  const touchStartX = useRef<number | null>(null);

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('anniversary_app_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bgMusic && parsed.bgMusic.includes('mixkit.co')) {
          parsed.bgMusic = defaultSettings.bgMusic;
        }
        setSettings(parsed);
        setInputNames(parsed.names || defaultSettings.names);
        setInputDate(parsed.relationshipStartDate || defaultSettings.relationshipStartDate);
        setInputMusic(parsed.bgMusic || defaultSettings.bgMusic);
      } catch (e) {
        setSettings(defaultSettings);
        setInputNames(defaultSettings.names);
        setInputDate(defaultSettings.relationshipStartDate);
        setInputMusic(defaultSettings.bgMusic);
      }
    } else {
      setSettings(defaultSettings);
      setInputNames(defaultSettings.names);
      setInputDate(defaultSettings.relationshipStartDate);
      setInputMusic(defaultSettings.bgMusic);
    }
  }, []);

  // Update background variables
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-brand-pink', settings.accentColor);
      const hex = settings.accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const purpleAccent = `rgba(${Math.min(r + 40, 255)}, ${Math.max(g - 40, 0)}, ${Math.min(b + 80, 255)}, 0.8)`;
      document.documentElement.style.setProperty('--color-brand-purple', purpleAccent);
    }
  }, [settings.accentColor]);

  // Audio setup
  useEffect(() => {
    if (!settings.bgMusic) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(settings.bgMusic);
    audio.loop = true;
    audioRef.current = audio;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
    };
  }, [settings.bgMusic]);

  const handleToggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Scene 1 Pre-loader sequence
  const [loadStep, setLoadStep] = useState(0);
  const loadingTexts = [
    'Finding memories...',
    'Loading smiles...',
    'Counting hugs...',
    'Finding embarrassing photos...',
    'Almost there...'
  ];

  useEffect(() => {
    if (sceneIndex === 1) {
      setLoadStep(0);
      const interval = setInterval(() => {
        setLoadStep((prev) => {
          if (prev < loadingTexts.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Auto advance to scene 2 (Chapter 1)
            setSceneIndex(2);
            return prev;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sceneIndex]);

  // Future sequence timer (starts when reaching the future scene index)
  // Let's determine the index of the Future Scene.
  // totalScenes calculation:
  // 0: Intro
  // 1: Pre-loading
  // 2: Chapter 1 Cover ("The Beginning")
  // 3-8: Timeline (6 items)
  // 9: Chapter 2 Cover ("Captured Instants")
  // 10-17: Gallery (8 items)
  // 18: Chapter 3 Cover ("Beautiful Chaos")
  // 19-23: Funny (5 items)
  // 24: Chapter 4 Cover ("A Love Letter")
  // 25: Love Letter Letter
  // 26: Chapter 5 Cover ("The Tomorrow")
  // 27: Future Scene
  // 28: Ending 1
  // 29: Ending 2
  // 30: Ending 3
  // 31: Ending 4 (Final screen with loop)
  const futureSceneIdx = 27;

  useEffect(() => {
    if (sceneIndex === futureSceneIdx) {
      setFutureStage('jokes');
      const glitchTimer = setTimeout(() => {
        setFutureStage('glitching');
      }, 7000); // 7s stay for jokes

      const revealTimer = setTimeout(() => {
        setFutureStage('revealed');
      }, 10000); // 3s stay for glitching (7000 + 3000)

      return () => {
        clearTimeout(glitchTimer);
        clearTimeout(revealTimer);
      };
    }
  }, [sceneIndex]);

  const totalScenes = 32;

  // Custom tap navigation
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Exclude button clicks, settings modal, or any setting form interactions
    const target = e.target as HTMLElement;
    if (target.closest('.no-tap-navigation') || showSettings) return;

    if (!hasInteracted) {
      setHasInteracted(true);
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }

    const clickX = e.clientX;
    const screenWidth = window.innerWidth;

    if (clickX > screenWidth * 0.45) {
      // Tap right: Next Scene (if not at final scene)
      if (sceneIndex < totalScenes - 1) {
        setSceneIndex(sceneIndex + 1);
      }
    } else {
      // Tap left: Previous Scene
      if (sceneIndex > 0) {
        setSceneIndex(sceneIndex - 1);
      }
    }
  };

  // Swiping support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> Next Scene
        if (sceneIndex < totalScenes - 1) {
          setSceneIndex(sceneIndex + 1);
        }
      } else {
        // Swipe right -> Previous Scene
        if (sceneIndex > 0) {
          setSceneIndex(sceneIndex - 1);
        }
      }
    }
    touchStartX.current = null;
  };

  // Safe save settings
  const handleSaveSettings = () => {
    const updated = {
      ...settings,
      names: inputNames,
      relationshipStartDate: inputDate,
      bgMusic: inputMusic
    };
    setSettings(updated);
    localStorage.setItem('anniversary_app_settings', JSON.stringify(updated));
    setShowSettings(false);
  };

  // Reset to the very first slide
  const handleReset = () => {
    setSceneIndex(0);
  };

  // Map scene indices to dynamic elements
  // 3-8: Timeline
  const isTimelineScene = sceneIndex >= 3 && sceneIndex <= 8;
  const timelineIdx = sceneIndex - 3;

  // 10-17: Gallery
  const isGalleryScene = sceneIndex >= 10 && sceneIndex <= 17;
  const galleryIdx = sceneIndex - 10;

  // 19-23: Funny
  const isFunnyScene = sceneIndex >= 19 && sceneIndex <= 23;
  const funnyIdx = sceneIndex - 19;

  // Helper categories for Future goals
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case 'nesting': return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink/20" />;
    }
  };

  return (
    <div
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 bg-[#09090B] text-zinc-100 flex flex-col justify-between font-sans select-none overflow-hidden touch-none"
    >
      
      {/* Background Ambient Mesh Glow */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[320px] md:w-[600px] h-[320px] md:h-[600px] rounded-full blur-[100px] pointer-events-none z-0 opacity-20 transition-all duration-1000"
        style={{ backgroundColor: 'var(--color-brand-pink)' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[320px] md:w-[600px] h-[320px] md:h-[600px] rounded-full blur-[100px] pointer-events-none z-0 opacity-20 transition-all duration-1000"
        style={{ backgroundColor: 'var(--color-brand-purple)' }}
      />

      {/* Cinematic Starfield Background (twinkles for A24 cosmic tone) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* INSTAGRAM-STORIES STYLE TOP NAVIGATION INDICATORS */}
      {sceneIndex > 0 && sceneIndex < totalScenes - 1 && (
        <div className="absolute top-4 inset-x-4 z-40 flex gap-1 px-1">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <div 
              key={i} 
              className="h-[2.5px] rounded-full flex-1 overflow-hidden bg-white/10"
            >
              <div 
                className="h-full bg-brand-pink transition-all duration-300"
                style={{
                  width: i < sceneIndex ? '100%' : i === sceneIndex ? '100%' : '0%',
                  opacity: i === sceneIndex ? 1 : 0.45,
                  transition: i === sceneIndex ? 'width 10s linear' : 'none'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* COGNITIVE HEADER FOR MUSIC / BACK NAVIGATION */}
      <div className="absolute top-10 inset-x-6 z-40 flex justify-between items-center pointer-events-none">
        
        {/* Subtle back text hint only when far into the movie */}
        {sceneIndex > 1 ? (
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            {sceneIndex} / {totalScenes - 1}
          </span>
        ) : (
          <div />
        )}

        {/* Dynamic Music Status Button */}
        <div className="no-tap-navigation flex items-center gap-2">
          {sceneIndex === 0 && (
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {sceneIndex > 0 && (
            <button
              onClick={handleToggleMusic}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer ${
                isPlaying 
                  ? 'bg-brand-pink/10 border-brand-pink/30 text-brand-pink' 
                  : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              {isPlaying ? (
                <Music className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* MAIN CINEMATIC WORKSPACE CONTAINER */}
      <div className="flex-grow w-full h-full flex flex-col justify-center items-center relative z-10">
        <AnimatePresence mode="wait">
          
          {/* =======================================================
              SCENE 0: INTRO HELLO CARD (A24 Style)
              ======================================================= */}
          {sceneIndex === 0 && (
            <motion.div
              key="scene0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="px-6 text-center max-w-sm flex flex-col gap-8 select-none"
            >
              <div className="flex justify-center mb-1">
                <div className="w-16 h-16 rounded-full border border-brand-pink/20 bg-brand-pink/5 flex items-center justify-center shadow-[0_0_30px_rgba(255,92,138,0.15)]">
                  <Heart className="w-7 h-7 text-brand-pink fill-brand-pink animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display leading-tight text-white">
                  730 Days
                </h1>
                <p className="text-2xl font-serif italic text-white/80 font-light tracking-wide">
                  Infinite Memories.
                </p>
                <p className="text-xs uppercase font-mono tracking-[0.25em] text-brand-pink/90 font-medium">
                  For One Beautiful Girl: {settings.names.split('&')[1] || 'You'}
                </p>
              </div>

              <div className="pt-10 flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.2em] animate-pulse">
                  Tap anywhere to begin
                </span>
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  (Tap left to go back, right to go forward)
                </span>
              </div>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 1: PRE-LOADER SCANNER (Spotify-Wrapped Style)
              ======================================================= */}
          {sceneIndex === 1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(15px)' }}
              className="px-8 text-center max-w-xs space-y-6 select-none"
            >
              <div className="h-[2px] w-48 bg-white/10 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-linear-to-r from-brand-pink to-brand-purple rounded-full"
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={loadStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xs uppercase tracking-widest text-zinc-400"
                >
                  {loadingTexts[loadStep]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 2: CHAPTER I COVER
              ======================================================= */}
          {sceneIndex === 2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              className="text-center px-6 max-w-sm space-y-4 select-none"
            >
              <span className="font-italiana text-6xl md:text-7xl block text-white/10 select-none">
                CHAPTER I
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif italic text-white tracking-wide">
                The Beginning
              </h2>
              <div className="w-10 h-[1px] bg-brand-pink/40 mx-auto my-4" />
              <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed">
                How a simple coffee date transformed into our forever.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENES 3-8: TIMELINE MEMORIES (Full-Screen Photography)
              ======================================================= */}
          {isTimelineScene && (
            <motion.div
              key={`timeline-${timelineIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Full-Screen Zoom Background */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.06 }}
                transition={{ duration: 10, ease: 'linear' }}
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${timelineData[timelineIdx].image})` }}
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-[#09090B]/40 via-[#09090B]/60 to-[#09090B] opacity-90 pointer-events-none" />

              {/* Memory Text Details */}
              <div className="absolute bottom-24 inset-x-6 space-y-6 max-w-md mx-auto pointer-events-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-brand-pink uppercase">
                    {timelineData[timelineIdx].date}
                  </span>
                  <h3 className="text-3xl font-serif italic font-light text-white leading-tight">
                    {timelineData[timelineIdx].title}
                  </h3>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed tracking-wide font-light">
                  {timelineData[timelineIdx].description}
                </p>

                {timelineData[timelineIdx].quote && (
                  <div className="pl-3.5 border-l border-brand-pink/30 italic font-serif text-xs text-brand-pink/80 py-1">
                    {timelineData[timelineIdx].quote}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 9: CHAPTER II COVER
              ======================================================= */}
          {sceneIndex === 9 && (
            <motion.div
              key="scene9"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              className="text-center px-6 max-w-sm space-y-4 select-none"
            >
              <span className="font-italiana text-6xl md:text-7xl block text-white/10 select-none">
                CHAPTER II
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif italic text-white tracking-wide">
                Captured Instants
              </h2>
              <div className="w-10 h-[1px] bg-brand-pink/40 mx-auto my-4" />
              <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed">
                The visual diary where moments stood still.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENES 10-17: GALLERY MOMENTS (Full-Screen Visuals)
              ======================================================= */}
          {isGalleryScene && (
            <motion.div
              key={`gallery-${galleryIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="absolute inset-0 w-full h-full"
            >
              {galleryData[galleryIdx].type === 'video' ? (
                <video
                  src={galleryData[galleryIdx].url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 8, ease: 'linear' }}
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${galleryData[galleryIdx].url})` }}
                />
              )}

              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/30 pointer-events-none" />

              {/* Subdued Bottom Caption */}
              <div className="absolute bottom-24 inset-x-6 max-w-sm mx-auto text-center pointer-events-none">
                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed drop-shadow-md italic font-serif">
                  "{galleryData[galleryIdx].caption}"
                </p>
              </div>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 18: CHAPTER III COVER
              ======================================================= */}
          {sceneIndex === 18 && (
            <motion.div
              key="scene18"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              className="text-center px-6 max-w-sm space-y-4 select-none"
            >
              <span className="font-italiana text-6xl md:text-7xl block text-white/10 select-none">
                CHAPTER III
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif italic text-white tracking-wide">
                Beautiful Chaos
              </h2>
              <div className="w-10 h-[1px] bg-brand-pink/40 mx-auto my-4" />
              <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed">
                The absolute best giggles, jokes, and sweet daily disasters.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENES 19-23: FUNNY MEMORIES (Cinematic Full Card)
              ======================================================= */}
          {isFunnyScene && (
            <motion.div
              key={`funny-${funnyIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.04 }}
                transition={{ duration: 7, ease: 'linear' }}
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${funnyData[funnyIdx].image})` }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#09090B]/30 via-[#09090B]/70 to-[#09090B] opacity-95 pointer-events-none" />

              <div className="absolute bottom-28 inset-x-6 max-w-sm mx-auto space-y-4 text-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                  Moment {funnyIdx + 1}
                </span>
                <h3 className="text-2xl font-semibold font-display text-white">
                  {funnyData[funnyIdx].text}
                </h3>
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-light">
                  {funnyData[funnyIdx].caption}
                </p>
              </div>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 24: CHAPTER IV COVER
              ======================================================= */}
          {sceneIndex === 24 && (
            <motion.div
              key="scene24"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              className="text-center px-6 max-w-sm space-y-4 select-none"
            >
              <span className="font-italiana text-6xl md:text-7xl block text-white/10 select-none">
                CHAPTER IV
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif italic text-white tracking-wide">
                A Love Letter
              </h2>
              <div className="w-10 h-[1px] bg-brand-pink/40 mx-auto my-4" />
              <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed">
                Quiet words spoken straight from my heart to yours.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 25: THE SCROLLING TYPEWRITER LOVE LETTER
              ======================================================= */}
          {sceneIndex === 25 && (
            <motion.div
              key="scene25"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="px-6 py-10 w-full max-w-md h-full max-h-[80vh] overflow-y-auto no-tap-navigation flex flex-col gap-6 scrollbar-none"
            >
              <div className="text-center mb-4">
                <span className="text-[10px] font-mono text-brand-pink uppercase tracking-[0.25em] bg-brand-pink/10 border border-brand-pink/10 px-3 py-1 rounded-full">
                  Dearest {settings.names.split('&')[1] || 'Maya'}
                </span>
              </div>

              {/* Minimal Parchment Scrolling Feel */}
              <div className="space-y-6 text-zinc-200 font-serif leading-relaxed text-sm md:text-base italic px-2">
                {letterData.map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.4, duration: 0.7 }}
                    className={
                      idx === 0 
                        ? "font-semibold text-white tracking-wide text-base not-italic font-display" 
                        : idx === letterData.length - 1 || idx === letterData.length - 2
                        ? "text-right font-display not-italic font-medium text-brand-pink/90 text-sm"
                        : "text-zinc-300 font-light first-letter:text-lg first-letter:font-semibold"
                    }
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <div className="text-center pt-8">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest animate-pulse">
                  Scroll or tap right to continue
                </span>
              </div>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 26: CHAPTER V COVER
              ======================================================= */}
          {sceneIndex === 26 && (
            <motion.div
              key="scene26"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
              className="text-center px-6 max-w-sm space-y-4 select-none"
            >
              <span className="font-italiana text-6xl md:text-7xl block text-white/10 select-none">
                CHAPTER V
              </span>
              <h2 className="text-4xl md:text-5xl font-light font-serif italic text-white tracking-wide">
                The Tomorrow
              </h2>
              <div className="w-10 h-[1px] bg-brand-pink/40 mx-auto my-4" />
              <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed">
                Cozy milestones and infinite roadmaps waiting for us.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 27: DYNAMIC JOKES-GLITCH FUTURE SEQUENCER
              ======================================================= */}
          {sceneIndex === 27 && (
            <motion.div
              key="scene27"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm px-6 py-6"
            >
              <AnimatePresence mode="wait">
                
                {/* STAGE A: JOKES CHECKLIST (7 seconds) */}
                {futureStage === 'jokes' && (
                  <motion.div
                    key="stage-jokes"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 justify-center"
                  >
                    <div className="text-center">
                      <span className="text-[9px] font-mono text-brand-pink bg-brand-pink/10 border border-brand-pink/20 px-3 py-1 rounded-full uppercase tracking-[0.2em] animate-pulse">
                        Calculating our future...
                      </span>
                      <h2 className="font-display text-2xl font-bold text-white mt-4 tracking-tight">
                        Our Next 10 Years
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3.5 max-w-xs mx-auto w-full glass-panel p-6 rounded-3xl border border-brand-pink/15 shadow-[0_0_20px_rgba(255,92,138,0.1)]">
                      {['Sex', 'Sex', 'Sex', 'Sex'].map((joke, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="flex items-center gap-3 text-lg font-display font-semibold text-brand-pink/90 py-1"
                        >
                          <Heart className="w-4 h-4 text-brand-pink fill-brand-pink/30" />
                          <span>{joke}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STAGE B: OVERLOAD GLITCH (3 seconds) */}
                {futureStage === 'glitching' && (
                  <motion.div
                    key="stage-glitch"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center gap-4"
                  >
                    <div className="font-mono text-3xl font-extrabold text-brand-pink tracking-widest skew-x-12 animate-pulse">
                      ⚡ SEX OVERLOAD
                    </div>
                    <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                      Calibrating logic... Loading dreams...
                    </div>
                  </motion.div>
                )}

                {/* STAGE C: THE REAL REVEALED ROADMAP */}
                {futureStage === 'revealed' && (
                  <motion.div
                    key="stage-revealed"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-5 text-left"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-brand-pink uppercase tracking-widest block mb-1">
                        Just kidding... mostly ❤️
                      </span>
                      <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                        Our Future Milestones
                      </h2>
                    </div>

                    {/* Non-scrolling bento-style goals */}
                    <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1 no-tap-navigation">
                      {futureData.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-xl border border-white/5 bg-zinc-900/60 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(255,92,138,0.6)]" />
                            <span className="text-xs font-medium text-zinc-200">
                              {item.text}
                            </span>
                          </div>
                          <div className="shrink-0 w-6 h-6 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5">
                            {getCategoryIcon(item.category)}
                          </div>
                        </motion.div>
                      ))}

                      {/* Final Hot highlighted item */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="p-3.5 rounded-xl border border-brand-pink/20 bg-linear-to-r from-brand-pink/5 to-brand-purple/5 flex items-center justify-between mt-1"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-brand-pink fill-brand-pink shrink-0" />
                          <span className="text-xs font-semibold text-zinc-200 italic">
                            ...and of course, endless warm cuddles & passionate Sex 😏
                          </span>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2 py-0.5 rounded-full border border-brand-pink/10">
                          Always
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 28: ENDING 1 (730 Days. 730 Reasons.)
              ======================================================= */}
          {sceneIndex === 28 && (
            <motion.div
              key="scene28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
              className="text-center px-6 max-w-sm space-y-6"
            >
              <h2 className="text-4xl font-extrabold tracking-tight text-white font-display leading-tight">
                730 Days.
              </h2>
              <h2 className="text-4xl font-serif italic font-light text-white/90">
                730 Reasons.
              </h2>
              <p className="text-xs uppercase font-mono tracking-[0.25em] text-brand-pink font-semibold">
                One Favourite Person.
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 29: ENDING 2 (This wasn't a website.)
              ======================================================= */}
          {sceneIndex === 29 && (
            <motion.div
              key="scene29"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
              className="text-center px-6"
            >
              <p className="text-3xl font-light font-serif italic text-white/80 leading-relaxed tracking-wide">
                "This wasn't a website."
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 30: ENDING 3 (It was a thank you.)
              ======================================================= */}
          {sceneIndex === 30 && (
            <motion.div
              key="scene30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
              className="text-center px-6"
            >
              <p className="text-3xl font-light font-serif italic text-white/80 leading-relaxed tracking-wide">
                "It was a thank you."
              </p>
            </motion.div>
          )}

          {/* =======================================================
              SCENE 31: ENDING 4 (I love you.)
              ======================================================= */}
          {sceneIndex === 31 && (
            <motion.div
              key="scene31"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-center px-6 space-y-8 select-none"
            >
              <div className="flex justify-center">
                <Heart className="w-12 h-12 text-brand-pink fill-brand-pink animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-italiana text-white tracking-widest uppercase">
                I Love You
              </h1>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Happy 2nd Anniversary, {settings.names.split('&')[1] || 'Maya'}
              </p>

              <div className="pt-8 no-tap-navigation flex justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Replay Film
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Settings className="w-3 h-3" /> Customize
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER COGNITIVE TAP INDICATORS (Only visible on scene index 0 to explain user controls) */}
      {sceneIndex === 0 && (
        <div className="absolute bottom-10 inset-x-6 text-center pointer-events-none z-20">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
            Leo & Maya
          </p>
        </div>
      )}

      {/* =======================================================
          MODAL: SETTINGS CUSTOMIZER (Elegant slide up)
          ======================================================= */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 no-tap-navigation"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#18181B] border border-white/10 rounded-[32px] w-full max-w-sm p-6 space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Customize Your Film</h3>
                <p className="text-xs text-zinc-400">Personalize names, timeline parameters and songs.</p>
              </div>

              <div className="space-y-4">
                {/* Names input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    Our Names
                  </label>
                  <input
                    type="text"
                    value={inputNames}
                    onChange={(e) => setInputNames(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                    placeholder="Leo & Maya"
                  />
                </div>

                {/* Anniversary Date input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    Anniversary Date
                  </label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                  />
                </div>

                {/* Soundtrack input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    Background Music (Direct MP3 URL)
                  </label>
                  <input
                    type="text"
                    value={inputMusic}
                    onChange={(e) => setInputMusic(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                    placeholder="https://..."
                  />
                  <p className="text-[9px] text-zinc-500">
                    Satie's Gymnopédie No.1 is recommended.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 rounded-full bg-brand-pink hover:bg-brand-pink/90 text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(255,92,138,0.2)] active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
