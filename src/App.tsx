import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, VolumeX, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

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
import CountdownScene from './components/scenes/CountdownScene';

// Editor Panel
import EditorPanel from './components/EditorPanel';

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle');

  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [timeline, setTimeline] = useState<TimelineItem[]>(timelineData);
  const [gallery, setGallery] = useState<GalleryItem[]>(galleryData);
  const [funny, setFunny] = useState<FunnyCard[]>(funnyData);
  const [letter, setLetter] = useState<string[]>(letterData);
  const [future, setFuture] = useState<BucketListItem[]>(futureData as BucketListItem[]);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [now, setNow] = useState(() => new Date());

  // Compute Reveal Gating Logic
  const isDesktop = windowWidth >= 1024;
  const isPreviewOverride = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'trueluv';
  const revealTargetTime = settings.revealDateTime ? new Date(settings.revealDateTime).getTime() : 0;
  // Bug 2 Fix: If revealDateTime is empty/unset, default to false (locked/countdown) rather than true
  const isPastRevealTime = revealTargetTime > 0 ? now.getTime() >= revealTargetTime : false;

  const isRevealed = isDesktop || isPreviewOverride || isPastRevealTime;

  // Timer tick every second to recompute countdown / reveal status (Bug 1 Fix: stops once revealed)
  useEffect(() => {
    if (isRevealed) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isRevealed]);

  // Monitor window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Swipe detection coordinates
  const touchStartX = useRef<number | null>(null);

  // Firebase Firestore real-time listener & initialization
  useEffect(() => {
    if (!db) {
      const savedSettings = localStorage.getItem('anniversary_app_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedTimeline = localStorage.getItem('anniversary_timeline');
      if (savedTimeline) setTimeline(JSON.parse(savedTimeline));

      const savedGallery = localStorage.getItem('anniversary_gallery');
      if (savedGallery) setGallery(JSON.parse(savedGallery));

      const savedFunny = localStorage.getItem('anniversary_funny');
      if (savedFunny) setFunny(JSON.parse(savedFunny));

      const savedLetter = localStorage.getItem('anniversary_letter');
      if (savedLetter) setLetter(JSON.parse(savedLetter));

      const savedFuture = localStorage.getItem('anniversary_future');
      if (savedFuture) setFuture(JSON.parse(savedFuture));

      setIsInitialLoading(false);
      return;
    }

    const storyDocRef = doc(db, 'story', 'main');

    const unsubscribe = onSnapshot(storyDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.settings) setSettings(data.settings);
        if (data.timeline) setTimeline(data.timeline);
        if (data.gallery) setGallery(data.gallery);
        if (data.funny) setFunny(data.funny);
        if (data.letter) setLetter(data.letter);
        if (data.future) setFuture(data.future);
        setIsInitialLoading(false);
      } else {
        // Initial setup: Seed Firestore with default story data
        try {
          const initialDoc = {
            settings: defaultSettings,
            timeline: timelineData,
            gallery: galleryData,
            funny: funnyData,
            letter: letterData,
            future: futureData
          };
          await setDoc(storyDocRef, initialDoc);
        } catch (err) {
          console.error('Error seeding initial Firestore document:', err);
        } finally {
          setIsInitialLoading(false);
        }
      }
    }, (err) => {
      console.error('Firestore snapshot listener error:', err);
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save changes to Firestore and localStorage
  const handleSaveStory = async (updates: Partial<{
    settings: AppSettings;
    timeline: TimelineItem[];
    gallery: GalleryItem[];
    funny: FunnyCard[];
    letter: string[];
    future: BucketListItem[];
  }>) => {
    if (updates.settings) {
      setSettings(updates.settings);
      localStorage.setItem('anniversary_app_settings', JSON.stringify(updates.settings));
    }
    if (updates.timeline) {
      setTimeline(updates.timeline);
      localStorage.setItem('anniversary_timeline', JSON.stringify(updates.timeline));
    }
    if (updates.gallery) {
      setGallery(updates.gallery);
      localStorage.setItem('anniversary_gallery', JSON.stringify(updates.gallery));
    }
    if (updates.funny) {
      setFunny(updates.funny);
      localStorage.setItem('anniversary_funny', JSON.stringify(updates.funny));
    }
    if (updates.letter) {
      setLetter(updates.letter);
      localStorage.setItem('anniversary_letter', JSON.stringify(updates.letter));
    }
    if (updates.future) {
      setFuture(updates.future);
      localStorage.setItem('anniversary_future', JSON.stringify(updates.future));
    }

    if (db) {
      setSaveStatus('saving');
      try {
        const storyDocRef = doc(db, 'story', 'main');
        await setDoc(storyDocRef, updates, { merge: true });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Error saving to Firestore:', err);
        setSaveStatus('error');
      }
    } else {
      setSaveStatus('idle');
    }
  };

  // Reset to Factory defaults helper
  const handleResetAll = async () => {
    localStorage.removeItem('anniversary_app_settings');
    localStorage.removeItem('anniversary_timeline');
    localStorage.removeItem('anniversary_gallery');
    localStorage.removeItem('anniversary_funny');
    localStorage.removeItem('anniversary_letter');
    localStorage.removeItem('anniversary_future');
    
    setSettings(defaultSettings);
    setTimeline(timelineData);
    setGallery(galleryData);
    setFunny(funnyData);
    setLetter(letterData);
    setFuture(futureData as BucketListItem[]);

    if (db) {
      setSaveStatus('saving');
      try {
        const storyDocRef = doc(db, 'story', 'main');
        await setDoc(storyDocRef, {
          settings: defaultSettings,
          timeline: timelineData,
          gallery: galleryData,
          funny: funnyData,
          letter: letterData,
          future: futureData
        });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Error resetting Firestore document:', err);
        setSaveStatus('error');
      }
    }
    setSceneIndex(0);
  };

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
    const target = e.target as HTMLElement;
    if (target.closest('.no-tap-navigation')) return;

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
      if (sceneIndex < totalScenes - 1) {
        setSceneIndex(sceneIndex + 1);
      }
    } else {
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
        if (sceneIndex < totalScenes - 1) {
          setSceneIndex(sceneIndex + 1);
        }
      } else {
        if (sceneIndex > 0) {
          setSceneIndex(sceneIndex - 1);
        }
      }
    }
    touchStartX.current = null;
  };

  // Partner's Name Helper
  const partnerName = settings.names.split('&')[1]?.trim() || settings.names || 'Maya';

  const handleLoadingSceneComplete = useCallback(() => {
    setSceneIndex(chap1Idx);
  }, [chap1Idx]);

  const handleInitialLoadingComplete = useCallback(() => {}, []);

  // Early Return while Initial Firestore / Local Data is Loading
  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center text-zinc-100">
        <LoadingScene onComplete={handleInitialLoadingComplete} />
      </div>
    );
  }

  // Dynamic Scene content builder
  let sceneContent = null;

  if (sceneIndex === introIdx) {
    sceneContent = <IntroScene partnerName={partnerName} />;
  } else if (sceneIndex === loadingIdx) {
    sceneContent = <LoadingScene onComplete={handleLoadingSceneComplete} />;
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
    sceneContent = <FutureScene futureData={future} />;
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
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <CountdownScene key="countdown" targetDateTime={settings.revealDateTime} />
        ) : (
          <motion.div
            key="story-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex h-full w-full relative"
          >
            {/* LEFT HALF / PANEL: Editor Workspace */}
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
                future={future}
                setFuture={setFuture}
                onSaveStory={handleSaveStory}
                saveStatus={saveStatus}
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
              {/* Soft central vignette back lighting */}
              <div className="absolute inset-0 bg-[#09090B] z-0" />
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[120px] pointer-events-none z-0 opacity-[0.06] transition-all duration-1000"
                style={{ backgroundColor: 'var(--color-brand-pink, #FF5C8A)' }}
              />

              {/* SOUNDTRACK STATUS CONTROLLER HEADER */}
              <div className="absolute top-8 inset-x-6 z-40 flex justify-between items-center pointer-events-none">
                <div />
                
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

