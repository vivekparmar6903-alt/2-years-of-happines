import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Compass, Heart, Home, Plane, Sparkles } from 'lucide-react';
import { BucketListItem } from '../../types';

interface FutureProps {
  bucketData: BucketListItem[];
  onBack: () => void;
}

export default function Future({ bucketData, onBack }: FutureProps) {
  const [stage, setStage] = useState<'jokes' | 'glitching' | 'revealed'>('jokes');

  // Glitch sequencing - sex jokes show for 7 seconds, then 3 seconds glitch, then real goals
  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      setStage('glitching');
    }, 7000); // 7 seconds duration

    const revealTimer = setTimeout(() => {
      setStage('revealed');
    }, 10000); // 3000ms glitch transition (7000 + 3000)

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-4 h-4 text-sky-400" />;
      case 'nesting': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'silly': return <Sparkles className="w-4 h-4 text-amber-400" />;
      default: return <Heart className="w-4 h-4 text-brand-pink" />;
    }
  };

  return (
    <div id="future-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Dreams Roadmap
        </span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STAGE 1: JOKES PREVIEW (Sex Joke Checklist, stays for 7s) */}
        {stage === 'jokes' && (
          <motion.div
            key="jokes"
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8 justify-center py-10"
          >
            <div className="text-center">
              <span className="text-[10px] font-mono text-brand-pink bg-brand-pink/5 border border-brand-pink/10 px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
                Thinking of the Future...
              </span>
              <h1 className="font-display text-2xl font-bold text-white mt-4 tracking-tight">Our Next 10 Years</h1>
            </div>

            {/* Glowing joke list */}
            <div className="flex flex-col gap-3.5 max-w-xs mx-auto w-full glass-panel p-6 rounded-3xl border border-brand-pink/15 shadow-[0_0_25px_rgba(255,92,138,0.12)]">
              {['Sex', 'Sex', 'Sex', 'Sex'].map((joke, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex items-center gap-3 text-lg font-display font-semibold text-brand-pink/90 py-1"
                >
                  <Heart className="w-4 h-4 text-brand-pink fill-brand-pink/40 shrink-0" />
                  <span>{joke}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">
              Connecting neural circuits...
            </p>
          </motion.div>
        )}

        {/* STAGE 2: GLITCH TRANSITION */}
        {stage === 'glitching' && (
          <motion.div
            key="glitch"
            className="flex flex-col items-center justify-center py-20 text-center gap-4"
            style={{ filter: 'hue-rotate(90deg)' }}
          >
            <div className="font-mono text-4xl font-extrabold text-brand-pink tracking-widest skew-x-12 animate-bounce">
              S3X OVERLOAD
            </div>
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
              System glitch! Loading real dreams...
            </div>
          </motion.div>
        )}

        {/* STAGE 3: THE REAL REVEALED ROADMAP (No checklists, pure beautiful goals) */}
        {stage === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Real Header */}
            <div>
              <div className="flex items-center gap-2 text-brand-pink text-xs font-mono uppercase tracking-widest mb-1.5">
                <Compass className="w-4 h-4 text-brand-pink animate-spin" style={{ animationDuration: '10s' }} />
                Shared Life Roadmap
              </div>
              <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Our Future Together</h1>
              
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                A beautiful blueprint of the infinite adventures, sweet homes, and cozy moments waiting for us.
              </p>
            </div>

            {/* Goals Container */}
            <div className="flex flex-col gap-3">
              {bucketData.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="w-full p-4 rounded-2xl border border-white/5 bg-zinc-900/40 flex items-center justify-between text-left transition-all hover:bg-zinc-900/60"
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    {/* Pink bullet indicator */}
                    <div className="shrink-0 w-2 h-2 rounded-full bg-brand-pink/80 shadow-[0_0_8px_rgba(255,92,138,0.6)]" />
                    
                    <span className="text-xs md:text-sm font-medium text-zinc-200 leading-relaxed">
                      {item.text}
                    </span>
                  </div>

                  {/* Category icon container */}
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-zinc-950/60 flex items-center justify-center border border-white/5 shadow-inner">
                    {getCategoryIcon(item.category)}
                  </div>
                </motion.div>
              ))}

              {/* Romantic Final Rephrased Bold Highlighted Goal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="w-full p-5 rounded-2xl border border-brand-pink/20 bg-linear-to-r from-brand-pink/5 to-brand-purple/5 flex items-center justify-between shadow-[0_4px_25px_rgba(255,92,138,0.1)] mt-2"
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <Heart className="w-5 h-5 text-brand-pink fill-brand-pink shrink-0 animate-pulse" />
                  <span className="text-xs md:text-sm font-display font-semibold text-zinc-200 leading-relaxed italic">
                    ...and of course, endless warm cuddles & passionate Sex 😏
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2.5 py-1 rounded-full border border-brand-pink/20 shrink-0">
                  Infinite
                </span>
              </motion.div>
            </div>

            {/* Heartfelt closing message */}
            <div className="glass-panel p-5 rounded-2xl text-center bg-zinc-950/35 border border-white/5 shadow-md">
              <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">
                Our Promise
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed font-light italic font-serif">
                "No matter where we go or what we do, every chapter will be beautiful because we write it together."
              </p>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
