import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface LandingProps {
  onBegin: () => void;
  names: string;
}

export default function Landing({ onBegin, names }: LandingProps) {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate star coordinates
    const generatedStars = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div id="landing-container" className="relative w-full h-screen overflow-hidden bg-bg-dark flex flex-col items-center justify-between py-16 px-6">
      {/* Animated Night Sky Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star, idx) => (
          <div
            key={idx}
            className="absolute bg-white rounded-full star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--delay': star.delay,
              '--duration': star.duration,
            } as React.CSSProperties}
          />
        ))}

        {/* Shooting Stars */}
        <div className="shooting-star" style={{ top: '15%', right: '10%', '--delay': '1s' } as React.CSSProperties} />
        <div className="shooting-star" style={{ top: '40%', right: '5%', '--delay': '5s' } as React.CSSProperties} />
        <div className="shooting-star" style={{ top: '5%', right: '25%', '--delay': '9s' } as React.CSSProperties} />
      </div>

      {/* Top Little Decorative Element */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-[0.25em]"
      >
        <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink animate-pulse" />
        An Anniversary Surpise
      </motion.div>

      {/* Core Typographic Hook */}
      <div className="z-10 text-center flex flex-col gap-6 max-w-sm mt-12 md:mt-0 justify-center flex-grow">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
        >
          730 Days
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="font-display text-3xl md:text-4xl font-light tracking-wide text-zinc-300"
        >
          Infinite Memories
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.2 }}
          className="font-display text-2xl md:text-3xl font-normal text-brand-pink italic"
        >
          One Beautiful Girl.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3.0 }}
          className="text-xs text-zinc-500 tracking-widest uppercase mt-2"
        >
          Dedicated to {names.split('&')[1]?.trim() || "Maya"}
        </motion.p>
      </div>

      {/* Call to Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.6, type: 'spring', stiffness: 80 }}
        className="z-10 w-full max-w-xs mb-6"
      >
        <button
          onClick={onBegin}
          className="group relative w-full py-4 bg-white text-zinc-950 font-display font-semibold text-base rounded-full shadow-[0_0_25px_rgba(255,255,255,0.15)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,92,138,0.4)] active:scale-95"
        >
          <span className="absolute inset-0 bg-linear-to-r from-brand-pink to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
            Begin <Heart className="w-4 h-4 text-brand-pink fill-brand-pink group-hover:text-white group-hover:fill-white transition-colors" />
          </span>
        </button>
      </motion.div>
    </div>
  );
}
