import React from 'react';
import { motion } from 'motion/react';
import { TimelineItem } from '../../types';

interface TimelineSceneProps {
  item: TimelineItem;
}

export default function TimelineScene({ item }: TimelineSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(5px)' }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 w-full h-full"
    >
      {/* Full-Screen Zoom Background */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 10, ease: 'linear' }}
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/90 pointer-events-none" />

      {/* Memory Text Details */}
      <div className="absolute bottom-24 inset-x-6 space-y-4 max-w-md mx-auto pointer-events-none px-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-brand-pink uppercase">
            {item.date}
          </span>
          <h3 className="text-2xl md:text-3xl font-serif italic font-light text-white leading-tight">
            {item.title}
          </h3>
        </div>

        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed tracking-wide font-light">
          {item.description}
        </p>

        {item.quote && (
          <div className="pl-3 border-l border-brand-pink/30 italic font-serif text-[11px] text-brand-pink/80 py-1">
            "{item.quote}"
          </div>
        )}
      </div>
    </motion.div>
  );
}
