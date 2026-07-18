import React from 'react';
import { motion } from 'motion/react';

interface LetterSceneProps {
  letterLines: string[];
  partnerName: string;
}

export default function LetterScene({ letterLines, partnerName }: LetterSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
      className="px-6 py-10 w-full max-w-md h-full max-h-[80vh] overflow-y-auto no-tap-navigation flex flex-col gap-6 scrollbar-none"
    >
      <div className="text-center mb-2">
        <span className="text-[10px] font-mono text-brand-pink uppercase tracking-[0.25em] bg-brand-pink/10 border border-brand-pink/20 px-3.5 py-1 rounded-full">
          Dearest {partnerName}
        </span>
      </div>

      <div className="space-y-6 text-zinc-200 font-serif leading-relaxed text-sm md:text-base italic px-2">
        {letterLines.map((paragraph, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.3, duration: 0.7 }}
            className={
              idx === 0
                ? "font-semibold text-white tracking-wide text-base not-italic font-display"
                : idx === letterLines.length - 1 || idx === letterLines.length - 2
                ? "text-right font-display not-italic font-medium text-brand-pink/90 text-sm"
                : "text-zinc-300 font-light first-letter:text-lg first-letter:font-semibold"
            }
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <div className="text-center pt-8">
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest animate-pulse">
          Scroll or tap right to continue
        </span>
      </div>
    </motion.div>
  );
}
