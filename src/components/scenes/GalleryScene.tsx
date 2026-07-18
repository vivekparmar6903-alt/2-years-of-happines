import React from 'react';
import { motion } from 'motion/react';
import { GalleryItem } from '../../types';

interface GallerySceneProps {
  item: GalleryItem;
}

export default function GalleryScene({ item }: GallerySceneProps) {
  const isVideo = item.type === 'video' || (item.url && item.url.match(/\.(mp4|webm|ogg)/i));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(5px)' }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 w-full h-full"
    >
      {isVideo ? (
        <video
          src={item.url}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 8, ease: 'linear' }}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${item.url})` }}
        />
      )}

      {/* Overlay shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Subdued Bottom Caption */}
      <div className="absolute bottom-24 inset-x-6 max-w-sm mx-auto text-center pointer-events-none px-4">
        <p className="text-xs md:text-sm text-zinc-200 leading-relaxed drop-shadow-md italic font-serif">
          "{item.caption}"
        </p>
      </div>
    </motion.div>
  );
}
