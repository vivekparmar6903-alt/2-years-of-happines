import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Image, Sparkles, Heart, HelpCircle, Compass, Settings, Clock } from 'lucide-react';
import { AppSettings } from '../../types';

interface DashboardProps {
  settings: AppSettings;
  onNavigate: (section: string) => void;
  timelineCount: number;
  galleryCount: number;
  funnyCount: number;
  bucketCount: number;
}

const ROMANTIC_QUOTES = [
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "If I had a flower for every time I thought of you... I could walk through my garden forever.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "To be your friend was all I ever wanted; to be your lover was all I ever dreamed.",
  "If you live to be a hundred, I want to live to be a hundred minus one day so I never have to live without you.",
  "We loved with a love that was more than love."
];

export default function Dashboard({
  settings,
  onNavigate,
  timelineCount,
  galleryCount,
  funnyCount,
  bucketCount
}: DashboardProps) {
  const [timeDiff, setTimeDiff] = useState({
    years: 2,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 730
  });
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Dynamic live countdown calculator
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(settings.relationshipStartDate);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();

      if (isNaN(diffMs) || diffMs < 0) {
        setTimeDiff({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
        return;
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      // Calculate years
      let years = now.getFullYear() - start.getFullYear();
      let startAnniversaryThisYear = new Date(start);
      startAnniversaryThisYear.setFullYear(now.getFullYear());
      
      if (now < startAnniversaryThisYear) {
        years--;
        startAnniversaryThisYear.setFullYear(now.getFullYear() - 1);
      }
      
      const diffRemainingMs = now.getTime() - startAnniversaryThisYear.getTime();
      const days = Math.floor(diffRemainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffRemainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffRemainingMs % (1000 * 60)) / 1000);

      setTimeDiff({ years, days, hours, minutes, seconds, totalDays });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.relationshipStartDate]);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div id="dashboard-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-6 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-2 mb-6 text-center mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-10 h-10 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink mb-1 shadow-[0_0_15px_rgba(255,92,138,0.15)]"
        >
          <Heart className="w-5 h-5 fill-brand-pink" />
        </motion.div>
        
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          {settings.siteTitle}
        </h1>
        <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
          Celebrating {settings.names}
        </p>
      </div>

      {/* Live Counter Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl flex flex-col gap-4 mb-6 shadow-xl relative overflow-hidden"
      >
        {/* Subtle glowing backdrop circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-pink/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5 text-brand-pink animate-spin" style={{ animationDuration: '6s' }} />
          Love Clock
        </div>

        {/* Big Total Days Number */}
        <div className="text-center py-2 flex flex-col">
          <span className="font-display text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-200 to-brand-pink tracking-tight">
            {timeDiff.totalDays} Days
          </span>
          <span className="text-zinc-500 text-xs mt-1 font-mono uppercase tracking-wider">
            of laughter, hugs, and growth
          </span>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-4 gap-2 text-center bg-zinc-950/40 py-3 px-2 rounded-2xl border border-white/5">
          <div>
            <p className="font-display text-xl font-bold text-white leading-none">
              {timeDiff.years}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-mono">Years</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-white leading-none">
              {timeDiff.days}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-mono">Days</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-white leading-none">
              {String(timeDiff.hours).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-mono">Hrs</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-white leading-none">
              {String(timeDiff.minutes).padStart(2, '0')}:{String(timeDiff.seconds).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-mono">Secs</p>
          </div>
        </div>
      </motion.div>

      {/* Rotating Love Quotes Block */}
      <div className="h-16 mb-6 flex items-center justify-center px-4">
        <p className="text-center text-xs italic text-zinc-400 font-light leading-relaxed">
          "{ROMANTIC_QUOTES[quoteIndex]}"
        </p>
      </div>

      {/* Core Bento Grid Navigation */}
      <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest mb-3 px-1">
        Our Memories Vault
      </h2>

      <div className="grid grid-cols-2 gap-3">
        
        {/* Card: Our Story */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('story')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Our Story</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">Interactive timeline</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-brand-pink bg-brand-pink/5 border border-brand-pink/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {timelineCount} Chapters
          </span>
        </motion.button>

        {/* Card: Gallery */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('gallery')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Gallery</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">Pinterest-style feed</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {galleryCount} Captures
          </span>
        </motion.button>

        {/* Card: Chaos */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('chaos')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Chaos</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">Funny generator</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {funnyCount} Laughs
          </span>
        </motion.button>

        {/* Card: For You (Love Letter) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('letter')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">For You</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">Handwritten note</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Heartfelt
          </span>
        </motion.button>

        {/* Card: Quiz */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('quiz')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Trivia Quiz</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">How well do we know?</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            10 Questions
          </span>
        </motion.button>

        {/* Card: Future */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('future')}
          className="glass-panel p-4 rounded-2xl flex flex-col gap-4 text-left relative overflow-hidden h-36 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Our Future</h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">Shared bucket list</p>
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-sky-400 bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {bucketCount} Dreams
          </span>
        </motion.button>

      </div>

      {/* Dynamic Personal Settings shortcut */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('settings')}
        className="w-full glass-panel mt-4 p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-white text-sm">Customizer Settings</h3>
            <p className="text-xs text-zinc-500 font-light">Tune names, dates, colors & tunes</p>
          </div>
        </div>
        <span className="text-xs text-brand-pink font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-lg bg-brand-pink/5 border border-brand-pink/10">
          Tune
        </span>
      </motion.button>

      {/* Footer Branding quote */}
      <div className="text-center mt-8 px-4 opacity-50">
        <p className="text-[11px] font-mono text-zinc-500 tracking-wider">
          COUPLE ID: {settings.names.toUpperCase().replace(/\s*&\s*/, '-')}-730
        </p>
        <p className="text-[10px] text-zinc-600 mt-1">
          Made with infinite ❤️ for our special day.
        </p>
      </div>

    </div>
  );
}
