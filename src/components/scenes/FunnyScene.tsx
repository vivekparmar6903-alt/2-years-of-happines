import React from 'react';
import { motion } from 'motion/react';
import { FunnyCard } from '../../types';

interface FunnySceneProps {
  item: FunnyCard;
  index: number;
}

export default function FunnyScene({ item, index }: FunnySceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(5px)' }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 w-full h-full"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.04 }}
        transition={{ duration: 7, ease: 'linear' }}
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90 pointer-events-none" />

      <div className="absolute bottom-28 inset-x-6 max-w-sm mx-auto space-y-3 text-center pointer-events-none px-4">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500">
          Moment {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-semibold font-display text-white">
          {item.text}
        </h3>
        <p className="text-zinc-300 text-xs leading-relaxed font-light">
          {item.caption}
        </p>
      </div>
    </motion.div>
  );
}
