import React from 'react';
import { motion } from 'motion/react';

interface IntroSceneProps {
  partnerName: string;
}

export default function IntroScene({ partnerName }: IntroSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center px-6 max-w-sm"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-7xl font-extrabold tracking-widest font-display text-white mb-2"
      >
        730
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-2xl font-serif italic text-zinc-400 font-light tracking-wide mb-6"
      >
        Infinite Memories
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="text-[10px] uppercase font-mono tracking-[0.25em] text-brand-pink font-medium"
      >
        For One Beautiful Girl: {partnerName}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ delay: 2.2, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="pt-16 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
          Tap anywhere to begin
        </span>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.15em]">
          Tap Left / Tap Right
        </span>
      </motion.div>
    </motion.div>
  );
}
