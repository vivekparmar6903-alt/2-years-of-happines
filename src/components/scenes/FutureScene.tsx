import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plane, Home } from 'lucide-react';
import { BucketListItem } from '../../types';

interface FutureSceneProps {
  futureData: BucketListItem[];
}

export default function FutureScene({ futureData }: FutureSceneProps) {
  const [stage, setStage] = useState<'jokes' | 'glitching' | 'revealed'>('jokes');

  useEffect(() => {
    // Stage A: Jokes shows for 7 seconds
    const glitchTimer = setTimeout(() => {
      setStage('glitching');
    }, 7000);

    // Stage B: Glitch shows for 3 seconds, then reveal real goals
    const revealTimer = setTimeout(() => {
      setStage('revealed');
    }, 10000);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel':
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case 'nesting':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink/20" />;
    }
  };

  return (
    <div className="w-full max-w-sm px-6 py-6 h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* STAGE A: JOKES CHECKLIST (7 seconds) */}
        {stage === 'jokes' && (
          <motion.div
            key="stage-jokes"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 justify-center"
          >
            <div className="text-center">
              <span className="text-[9px] font-mono text-brand-pink bg-brand-pink/10 border border-brand-pink/20 px-3 py-1 rounded-full uppercase tracking-[0.2em] animate-pulse">
                Calculating our future...
              </span>
              <h2 className="font-display text-2xl font-bold text-white mt-4 tracking-tight">
                Our Next 10 Years
              </h2>
            </div>

            <div className="flex flex-col gap-3.5 max-w-xs mx-auto w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-[0_0_20px_rgba(255,92,138,0.05)]">
              {['Sex', 'Sex', 'Sex', 'Sex'].map((joke, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex items-center gap-3 text-lg font-display font-semibold text-brand-pink/90 py-1"
                >
                  <Heart className="w-4 h-4 text-brand-pink fill-brand-pink/30" />
                  <span>{joke}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STAGE B: OVERLOAD GLITCH (3 seconds) */}
        {stage === 'glitching' && (
          <motion.div
            key="stage-glitch"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center gap-4"
          >
            <div className="font-mono text-3xl font-extrabold text-brand-pink tracking-widest skew-x-12 animate-pulse">
              ⚡ SEX OVERLOAD
            </div>
            <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              Calibrating logic... Loading dreams...
            </div>
          </motion.div>
        )}

        {/* STAGE C: THE REAL REVEALED ROADMAP */}
        {stage === 'revealed' && (
          <motion.div
            key="stage-revealed"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 text-left"
          >
            <div>
              <span className="text-[10px] font-mono text-brand-pink uppercase tracking-widest block mb-1">
                Just kidding... mostly ❤️
              </span>
              <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                Our Future Milestones
              </h2>
            </div>

            {/* Non-scrolling bento-style goals */}
            <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1 no-tap-navigation scrollbar-none">
              {futureData.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-xl border border-white/5 bg-zinc-900/60 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(255,92,138,0.6)]" />
                    <span className="text-xs font-medium text-zinc-200">
                      {item.text}
                    </span>
                  </div>
                  <div className="shrink-0 w-6 h-6 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5">
                    {getCategoryIcon(item.category)}
                  </div>
                </motion.div>
              ))}

              {/* Final Hot highlighted item */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="p-3 rounded-xl border border-brand-pink/20 bg-gradient-to-r from-brand-pink/5 to-brand-purple/5 flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-brand-pink fill-brand-pink shrink-0" />
                  <span className="text-xs font-semibold text-zinc-200 italic">
                    ...and endless warm cuddles & passionate sex 😏
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2 py-0.5 rounded-full border border-brand-pink/10">
                  Always
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
