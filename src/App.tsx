/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, Image, Mail, Compass, Settings, Music, VolumeX, Sparkles } from 'lucide-react';

import { AppSettings, TimelineItem, GalleryItem, FunnyCard, QuizQuestion, BucketListItem } from './types';

// Load default JSON structures
import defaultSettings from './data/settings.json';
import timelineData from './data/timeline.json';
import galleryData from './data/gallery.json';
import funnyData from './data/funny.json';
import quizData from './data/quiz.json';
import futureData from './data/future.json';
import letterData from './data/letter.json';

// Import modular screens
import Landing from './components/sections/Landing';
import Loading from './components/sections/Loading';
import Dashboard from './components/sections/Dashboard';
import Story from './components/sections/Story';
import Gallery from './components/sections/Gallery';
import Chaos from './components/sections/Chaos';
import Quiz from './components/sections/Quiz';
import ForYou from './components/sections/ForYou';
import Future from './components/sections/Future';
import SettingsView from './components/sections/SettingsView';

type Section = 'landing' | 'loading' | 'dashboard' | 'story' | 'gallery' | 'chaos' | 'quiz' | 'letter' | 'future' | 'settings';

export default function App() {
  const [section, setSection] = useState<Section>('landing');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Floating floating hearts array
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);

  // 1. Initialize and load user settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('anniversary_app_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old broken mixkit audio link to stable mfiles Chopin link
        if (parsed.bgMusic && parsed.bgMusic.includes('mixkit.co')) {
          parsed.bgMusic = defaultSettings.bgMusic;
          localStorage.setItem('anniversary_app_settings', JSON.stringify(parsed));
        }
        setSettings(parsed);
      } catch (e) {
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
    }

    // Generate floating hearts coordinates
    const generatedHearts = Array.from({ length: 15 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      size: Math.random() * 12 + 8,
      delay: Math.random() * 4,
      duration: Math.random() * 6 + 4
    }));
    setHearts(generatedHearts);
  }, []);

  // 2. Reactively bind dynamic CSS theme variables
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-brand-pink', settings.accentColor);
      
      // Calculate a secondary purple/rose tint
      const hex = settings.accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const purpleAccent = `rgba(${Math.min(r + 40, 255)}, ${Math.max(g - 40, 0)}, ${Math.min(b + 80, 255)}, 0.8)`;
      document.documentElement.style.setProperty('--color-brand-purple', purpleAccent);
    }
  }, [settings.accentColor]);

  // 3. Audio Stream manager
  useEffect(() => {
    if (!settings.bgMusic) return;

    // Tear down existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(settings.bgMusic);
    audio.loop = true;
    audioRef.current = audio;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
    };
  }, [settings.bgMusic]);

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio play blocked", e);
      });
    }
  };

  // Launch from Splash -> Loading Screen
  const handleBegin = () => {
    setSection('loading');
    
    // Attempt to start music smoothly on the click gesture
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Safe callback when settings are updated in SettingsView
  const handleSaveSettings = (updated: AppSettings) => {
    setSettings(updated);
    localStorage.setItem('anniversary_app_settings', JSON.stringify(updated));
    setSection('dashboard');
  };

  const showNav = section !== 'landing' && section !== 'loading';

  return (
    <div className="min-h-screen bg-bg-dark text-zinc-100 flex flex-col justify-between font-sans relative antialiased overflow-x-hidden">
      
      {/* Background Mesh Glow (Elegant Dark Theme) */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[80px] md:blur-[140px] pointer-events-none z-0 opacity-15"
        style={{ backgroundColor: 'var(--color-brand-pink)' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[80px] md:blur-[140px] pointer-events-none z-0 opacity-15"
        style={{ backgroundColor: 'var(--color-brand-purple)' }}
      />
      
      {/* Background Floating Ambient Hearts (Only in dashboard and inner pages for romantic aesthetics) */}
      {showNav && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{
                y: '-10vh',
                opacity: [0, 0.4, 0.4, 0],
                x: [0, 15, -15, 0]
              }}
              transition={{
                duration: heart.duration,
                repeat: Infinity,
                delay: heart.delay,
                ease: 'easeInOut'
              }}
              className="absolute text-brand-pink/15"
              style={{
                left: `${heart.left}%`,
                width: `${heart.size}px`,
                height: `${heart.size}px`
              }}
            >
              <Heart className="w-full h-full fill-current" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Container centering content nicely on desktop, scaling perfectly on phones */}
      <main className="flex-grow w-full relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Section: Splash Landing */}
          {section === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Landing onBegin={handleBegin} names={settings.names} />
            </motion.div>
          )}

          {/* Section: Faux Loading Sequencer */}
          {section === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Loading onComplete={() => setSection('dashboard')} />
            </motion.div>
          )}

          {/* Core Applet Switcher */}
          {section === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard
                settings={settings}
                onNavigate={(dest) => setSection(dest as Section)}
                timelineCount={(timelineData as TimelineItem[]).length}
                galleryCount={(galleryData as GalleryItem[]).length}
                funnyCount={(funnyData as FunnyCard[]).length}
                bucketCount={(futureData as BucketListItem[]).length}
              />
            </motion.div>
          )}

          {section === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Story timelineData={timelineData as TimelineItem[]} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Gallery galleryData={galleryData as GalleryItem[]} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'chaos' && (
            <motion.div
              key="chaos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Chaos funnyData={funnyData as FunnyCard[]} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Quiz quizData={quizData as QuizQuestion[]} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ForYou letterData={letterData} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'future' && (
            <motion.div
              key="future"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Future bucketData={futureData as BucketListItem[]} onBack={() => setSection('dashboard')} />
            </motion.div>
          )}

          {section === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsView
                settings={settings}
                onSave={handleSaveSettings}
                onBack={() => setSection('dashboard')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FLOATING MUSIC CONTROLLER BUTTON (Kept completely in top-right area to avoid bottom-tab collision on mobile) */}
      {showNav && (
        <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
          
          {/* Play/Wave state lines (Only visible when music is playing!) */}
          {isPlaying && (
            <div className="bg-black/40 backdrop-blur-md border border-white/5 h-8 px-2 rounded-lg flex items-center gap-0.5 pointer-events-none select-none">
              <span className="w-0.5 h-3.5 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
              <span className="w-0.5 h-4.5 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }} />
              <span className="w-0.5 h-2.5 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.5s' }} />
              <span className="w-0.5 h-4 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '0.7s' }} />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMusic}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border transition-all duration-300 cursor-pointer ${
              isPlaying
                ? 'bg-brand-pink/20 border-brand-pink/30 text-brand-pink animate-spin'
                : 'bg-zinc-900/80 border-white/10 text-zinc-400'
            }`}
            style={{ animationDuration: '10s' }}
          >
            {isPlaying ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>
        </div>
      )}

      {/* GLASSMORPHISM BOTTOM NAVIGATION TAB BAR */}
      {showNav && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="fixed bottom-0 inset-x-0 h-20 glass-nav flex items-center justify-around px-4 pb-2 z-40"
        >
          {/* Tab item: Home (Dashboard) */}
          <button
            onClick={() => setSection('dashboard')}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              section === 'dashboard' ? 'text-brand-pink' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Heart className={`w-5.5 h-5.5 ${section === 'dashboard' ? 'fill-brand-pink' : ''}`} />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">Home</span>
          </button>

          {/* Tab item: Our Story (Timeline) */}
          <button
            onClick={() => setSection('story')}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              section === 'story' ? 'text-brand-pink' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-5.5 h-5.5" />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">Story</span>
          </button>

          {/* Tab item: Gallery */}
          <button
            onClick={() => setSection('gallery')}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              section === 'gallery' ? 'text-brand-pink' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Image className="w-5.5 h-5.5" />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">Gallery</span>
          </button>

          {/* Tab item: Love Letter */}
          <button
            onClick={() => setSection('letter')}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              section === 'letter' ? 'text-brand-pink' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Mail className="w-5.5 h-5.5" />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">Letter</span>
          </button>

          {/* Tab item: Future */}
          <button
            onClick={() => setSection('future')}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              section === 'future' ? 'text-brand-pink' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Compass className="w-5.5 h-5.5" />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">Future</span>
          </button>
        </motion.nav>
      )}

    </div>
  );
}
