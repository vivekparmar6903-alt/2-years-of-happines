import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, VolumeX, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

import { AppSettings, TimelineItem, GalleryItem, FunnyCard, BucketListItem } from './types';

// Load default JSON structures
import defaultSettings from './data/settings.json';
import timelineData from './data/timeline.json';
import galleryData from './data/gallery.json';
import funnyData from './data/funny.json';
import futureData from './data/future.json';
import letterData from './data/letter.json';

// Scene Components
import IntroScene from './components/scenes/IntroScene';
import LoadingScene from './components/scenes/LoadingScene';
import ChapterTitleScene from './components/scenes/ChapterTitleScene';
import TimelineScene from './components/scenes/TimelineScene';
import GalleryScene from './components/scenes/GalleryScene';
import FunnyScene from './components/scenes/FunnyScene';
import LetterScene from './components/scenes/LetterScene';
import FutureScene from './components/scenes/FutureScene';
import EndingScene from './components/scenes/EndingScene';

// Editor Panel
import EditorPanel from './components/EditorPanel';

export default function App() {
  // Load data dynamically with localStorage persistence for customized runs
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('anniversary_app_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    const saved = localStorage.getItem('anniversary_timeline');
    return saved ? JSON.parse(saved) : timelineData;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('anniversary_gallery');
    return saved ? JSON.parse(saved) : galleryData;
  });

  const [funny, setFunny] = useState<FunnyCard[]>(() => {
    const saved = localStorage.getItem('anniversary_funny');
    return saved ? JSON.parse(saved) : funnyData;
  });

  const [letter, setLetter] = useState<string[]>(() => {
    const saved = localStorage.getItem('anniversary_letter');
    return saved ? JSON.parse(saved) : letterData;
  });

  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Swipe detection coordinates
  const touchStartX = useRef<number | null>(null);

  // Responsive mode check
  useEffect(() => {
    const checkEditMode = () => {
      const params = new URLSearchParams(window.location.search);
      const hasParam = params.get('edit') === 'ourstory';
      const isDesktop = window.innerWidth >= 1024;
      setIsEditMode(hasParam && isDesktop);
    };

    checkEditMode();
    window.addEventListener('resize', checkEditMode);
    return () => window.removeEventListener('resize', checkEditMode);
  }, []);

  // Update background styling variable for accents
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-brand-pink', settings.accentColor);
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

  // Dynamic Scene Navigation Coordinates & Index Mapping
  const introIdx = 0;
  const loadingIdx = 1;
  const chap1Idx = 2;

  const timelineStart = 3;
  const timelineEnd = timelineStart + timeline.length - 1;

  const chap2Idx = timelineEnd + 1;
  const galleryStart = chap2Idx + 1;
  const galleryEnd = galleryStart + gallery.length - 1;

  const chap3Idx = galleryEnd + 1;
  const funnyStart = chap3Idx + 1;
  const funnyEnd = funnyStart + funny.length - 1;

  const chap4Idx = funnyEnd + 1;
  const letterIdx = chap4Idx + 1;

  const chap5Idx = letterIdx + 1;
  const futureIdx = chap5Idx + 1;

  const ending1Idx = futureIdx + 1;
  const ending2Idx = ending1Idx + 1;
  const ending3Idx = ending2Idx + 1;
  const ending4Idx = ending3Idx + 1;

  const totalScenes = ending4Idx + 1;

  // Navigation Handlers
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Exclude button clicks, settings modal, or form inputs
    const target = e.target as HTMLElement;
    if (target.closest('.no-tap-navigation')) return;

    // Trigger music play on first interaction
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
      // Tap right: Next Scene
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

  // Reset to Factory defaults helper
  const handleResetAll = () => {
    localStorage.removeItem('anniversary_app_settings');
    localStorage.removeItem('anniversary_timeline');
    localStorage.removeItem('anniversary_gallery');
    localStorage.removeItem('anniversary_funny');
    localStorage.removeItem('anniversary_letter');
    
    setSettings(defaultSettings);
    setTimeline(timelineData);
    setGallery(galleryData);
    setFunny(funnyData);
    setLetter(letterData);
    setSceneIndex(0);
  };

  // Partner's Name Helper
  const partnerName = settings.names.split('&')[1]?.trim() || settings.names || 'Maya';

  // Dynamic Scene content builder
  let sceneContent = null;

  if (sceneIndex === introIdx) {
    sceneContent = <IntroScene partnerName={partnerName} />;
  } else if (sceneIndex === loadingIdx) {
    sceneContent = <LoadingScene onComplete={() => setSceneIndex(chap1Idx)} />;
  } else if (sceneIndex === chap1Idx) {
    sceneContent = (
      <ChapterTitleScene
        chapterNumber="CHAPTER I"
        title="The Beginning"
        description="How a simple coffee date transformed into our forever."
      />
    );
  } else if (sceneIndex >= timelineStart && sceneIndex <= timelineEnd) {
    const item = timeline[sceneIndex - timelineStart];
    if (item) {
      sceneContent = <TimelineScene item={item} />;
    }
  } else if (sceneIndex === chap2Idx) {
    sceneContent = (
      <ChapterTitleScene
        chapterNumber="CHAPTER II"
        title="Captured Instants"
        description="The visual diary where moments stood still."
      />
    );
  } else if (sceneIndex >= galleryStart && sceneIndex <= galleryEnd) {
    const item = gallery[sceneIndex - galleryStart];
    if (item) {
      sceneContent = <GalleryScene item={item} />;
    }
  } else if (sceneIndex === chap3Idx) {
    sceneContent = (
      <ChapterTitleScene
        chapterNumber="CHAPTER III"
        title="Beautiful Chaos"
        description="The absolute best giggles, jokes, and sweet daily disasters."
      />
    );
  } else if (sceneIndex >= funnyStart && sceneIndex <= funnyEnd) {
    const item = funny[sceneIndex - funnyStart];
    const itemIndex = sceneIndex - funnyStart;
    if (item) {
      sceneContent = <FunnyScene item={item} index={itemIndex} />;
    }
  } else if (sceneIndex === chap4Idx) {
    sceneContent = (
      <ChapterTitleScene
        chapterNumber="CHAPTER IV"
        title="A Love Letter"
        description="Quiet words spoken straight from my heart to yours."
      />
    );
  } else if (sceneIndex === letterIdx) {
    sceneContent = <LetterScene letterLines={letter} partnerName={partnerName} />;
  } else if (sceneIndex === chap5Idx) {
    sceneContent = (
      <ChapterTitleScene
        chapterNumber="CHAPTER V"
        title="The Tomorrow"
        description="Cozy milestones and infinite roadmaps waiting for us."
      />
    );
  } else if (sceneIndex === futureIdx) {
    sceneContent = <FutureScene futureData={futureData as BucketListItem[]} />;
  } else if (sceneIndex === ending1Idx) {
    sceneContent = <EndingScene subStage={1} partnerName={partnerName} onReplay={() => setSceneIndex(0)} />;
  } else if (sceneIndex === ending2Idx) {
    sceneContent = <EndingScene subStage={2} partnerName={partnerName} onReplay={() => setSceneIndex(0)} />;
  } else if (sceneIndex === ending3Idx) {
    sceneContent = <EndingScene subStage={3} partnerName={partnerName} onReplay={() => setSceneIndex(0)} />;
  } else if (sceneIndex === ending4Idx) {
    sceneContent = <EndingScene subStage={4} partnerName={partnerName} onReplay={() => setSceneIndex(0)} />;
  }

  return (
    <div className="fixed inset-0 bg-[#09090B] flex h-full w-full select-none overflow-hidden text-zinc-100">
      
      {/* LEFT HALF / PANEL: Editor Workspace (Only mounts when screen is wide AND edit parameter is true) */}
      {isEditMode && (
        <EditorPanel
          settings={settings}
          setSettings={setSettings}
          timeline={timeline}
          setTimeline={setTimeline}
          gallery={gallery}
          setGallery={setGallery}
          funny={funny}
          setFunny={setFunny}
          letter={letter}
          setLetter={setLetter}
          onResetAll={handleResetAll}
          sceneIndex={sceneIndex}
          setSceneIndex={setSceneIndex}
        />
      )}

      {/* RIGHT HALF / VIEWPORT: Cinematic Love Story Film */}
      <div 
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 h-full relative flex flex-col justify-between overflow-hidden cursor-pointer"
      >
        {/* Soft, beautiful, single-color subtle central vignette back lighting */}
        <div className="absolute inset-0 bg-[#09090B] z-0" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[120px] pointer-events-none z-0 opacity-[0.06] transition-all duration-1000"
          style={{ backgroundColor: 'var(--color-brand-pink, #FF5C8A)' }}
        />

        {/* SOUNDTRACK STATUS CONTROLLER HEADER */}
        <div className="absolute top-8 inset-x-6 z-40 flex justify-between items-center pointer-events-none">
          <div /> {/* spacing */}
          
          {/* Audio controller */}
          {sceneIndex > 0 && (
            <div className="no-tap-navigation">
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
            </div>
          )}
        </div>

        {/* ACTIVE SCENE WORKSPACE */}
        <div className="flex-grow w-full h-full flex flex-col justify-center items-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col justify-center items-center relative"
            >
              {sceneContent}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* LOWER FOOTER */}
        {sceneIndex === 0 && (
          <div className="absolute bottom-10 inset-x-6 text-center pointer-events-none z-20">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
              {settings.names || 'Leo & Maya'}
            </p>
          </div>
        )}

        {/* CINEMATIC BOTTOM NAVIGATION ARROWS */}
        <div className="absolute bottom-6 inset-x-6 z-40 flex justify-between items-center pointer-events-none no-tap-navigation">
          {sceneIndex > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSceneIndex(sceneIndex - 1);
              }}
              className="pointer-events-auto p-2 rounded-full text-zinc-400 hover:text-white transition-all duration-300 opacity-40 hover:opacity-100 active:scale-90 cursor-pointer"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}

          {sceneIndex < totalScenes - 1 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSceneIndex(sceneIndex + 1);
              }}
              className="pointer-events-auto p-2 rounded-full text-zinc-400 hover:text-white transition-all duration-300 opacity-40 hover:opacity-100 active:scale-90 cursor-pointer"
              title="Next Scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>

      </div>

    </div>
  );
}
