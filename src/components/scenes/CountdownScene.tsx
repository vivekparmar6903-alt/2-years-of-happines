import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownSceneProps {
  key?: React.Key;
  targetDateTime?: string;
}

export default function CountdownScene({ targetDateTime = '2026-08-15T00:00:00' }: CountdownSceneProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDateTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateTime]);

  // Formatted date string, e.g., "August 15, 2026"
  const formattedTargetDate = formatTargetDate(targetDateTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="fixed inset-0 bg-[#09090B] flex flex-col justify-between items-center text-center px-6 py-12 text-zinc-100 z-50 overflow-hidden select-none"
    >
      {/* Richer Ambient Background with Drifting Gradient Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Shape 1: Top-Left Warm Pink Accent */}
        <motion.div
          animate={{
            x: [0, 45, -25, 0],
            y: [0, -35, 30, 0],
            opacity: [0.06, 0.09, 0.05, 0.06],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full blur-[140px]"
          style={{ backgroundColor: 'var(--color-brand-pink, #FF5C8A)' }}
        />

        {/* Shape 2: Bottom-Right Deep Neutral Violet */}
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
            opacity: [0.05, 0.08, 0.04, 0.05],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-28 -right-24 w-[550px] h-[550px] rounded-full blur-[160px]"
          style={{ backgroundColor: '#4C1D95' }}
        />

        {/* Shape 3: Center-Right Soft Rose Glow */}
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, -40, 25, 0],
            opacity: [0.03, 0.06, 0.03, 0.03],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 -right-12 w-[380px] h-[380px] rounded-full blur-[130px]"
          style={{ backgroundColor: '#E11D48' }}
        />

        {/* Film-grain SVG Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay">
          <svg className="w-full h-full">
            <filter id="countdown-noise-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#countdown-noise-filter)" />
          </svg>
        </div>
      </div>

      {/* 1. Small quiet top-of-screen header motif */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8 }}
        className="z-10 pt-4"
      >
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400">
          730
        </span>
      </motion.div>

      {/* Center content block */}
      <div className="z-10 flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* 2. Large serif headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif italic text-white tracking-wide mb-2 font-light"
        >
          Not yet.
        </motion.h1>

        {/* 3. Lighter weight serif subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="text-lg md:text-xl font-serif italic text-zinc-400 font-extralight tracking-wider mb-10"
        >
          But soon.
        </motion.p>

        {/* 4. Live Countdown row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-4 gap-2 md:gap-4 w-full px-2 py-6 border-y border-zinc-900/80 my-2"
        >
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center">
              <div className="h-12 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight"
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[9px] md:text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-500 mt-1 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 5. Warm quiet line of body text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="text-xs font-sans text-zinc-400/90 tracking-wide mt-8 font-light"
        >
          Something is being written for you.
        </motion.p>
      </div>

      {/* 6. Formatted target date at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="z-10 pb-4"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500">
          {formattedTargetDate}
        </span>
      </motion.div>
    </motion.div>
  );
}

// Helper: Calculate remaining time
function calculateTimeLeft(targetIso?: string) {
  if (!targetIso) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// Helper: Format target date as "August 15, 2026"
function formatTargetDate(targetIso?: string): string {
  if (!targetIso) return '';
  const date = new Date(targetIso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
