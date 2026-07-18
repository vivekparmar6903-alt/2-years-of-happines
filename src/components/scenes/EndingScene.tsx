import React from 'react';
import { motion } from 'motion/react';
import { Heart, RefreshCw } from 'lucide-react';

interface EndingSceneProps {
  subStage: 1 | 2 | 3 | 4;
  partnerName: string;
  onReplay: () => void;
}

export default function EndingScene({ subStage, partnerName, onReplay }: EndingSceneProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden">
      {/* Stars payoff only in final scene */}
      {subStage === 4 && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
          {Array.from({ length: 45 }).map((_, i) => (
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
      )}

      <div className="relative z-10 px-6 text-center max-w-sm">
        {subStage === 1 && (
          <motion.div
            key="ending-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-white font-display leading-tight">
              730 Days.
            </h2>
            <h2 className="text-4xl font-serif italic font-light text-zinc-300">
              730 Reasons.
            </h2>
            <p className="text-xs uppercase font-mono tracking-[0.25em] text-brand-pink font-semibold">
              One Favourite Person.
            </p>
          </motion.div>
        )}

        {subStage === 2 && (
          <motion.div
            key="ending-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
          >
            <p className="text-3xl font-light font-serif italic text-white/80 leading-relaxed tracking-wide">
              "This wasn't a website."
            </p>
          </motion.div>
        )}

        {subStage === 3 && (
          <motion.div
            key="ending-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
          >
            <p className="text-3xl font-light font-serif italic text-white/80 leading-relaxed tracking-wide">
              "It was a thank you."
            </p>
          </motion.div>
        )}

        {subStage === 4 && (
          <motion.div
            key="ending-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="space-y-8 select-none"
          >
            <div className="flex justify-center">
              <Heart className="w-12 h-12 text-brand-pink fill-brand-pink animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-italiana text-white tracking-widest uppercase">
              I Love You
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Happy 2nd Anniversary, {partnerName}
            </p>

            <div className="pt-8 no-tap-navigation flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplay();
                }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Replay Film
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
