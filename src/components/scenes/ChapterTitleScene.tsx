import React from 'react';
import { motion } from 'motion/react';

interface ChapterTitleSceneProps {
  chapterNumber: string;
  title: string;
  description: string;
}

export default function ChapterTitleScene({ chapterNumber, title, description }: ChapterTitleSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center px-6 max-w-sm space-y-4 flex flex-col justify-center items-center h-full"
    >
      <span className="font-italiana text-5xl md:text-6xl block text-white/10 tracking-widest uppercase">
        {chapterNumber}
      </span>
      <h2 className="text-3xl md:text-4xl font-light font-serif italic text-white tracking-wide">
        {title}
      </h2>
      <div className="w-10 h-[1px] bg-brand-pink/30 my-4" />
      <p className="text-xs uppercase font-mono tracking-[0.2em] text-zinc-500 leading-relaxed max-w-[280px]">
        {description}
      </p>
    </motion.div>
  );
}
