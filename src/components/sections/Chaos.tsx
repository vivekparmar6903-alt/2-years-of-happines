import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, RefreshCw, MessageSquareDashed } from 'lucide-react';
import { FunnyCard } from '../../types';

interface ChaosProps {
  funnyData: FunnyCard[];
  onBack: () => void;
}

export default function Chaos({ funnyData, onBack }: ChaosProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Draw a new random index that is different from the current one
  const handleShuffle = () => {
    if (funnyData.length <= 1) return;
    
    setDirection(Math.random() > 0.5 ? 'left' : 'right');
    let nextIdx = currentIdx;
    while (nextIdx === currentIdx) {
      nextIdx = Math.floor(Math.random() * funnyData.length);
    }
    
    setCurrentIdx(nextIdx);
  };

  const currentCard = funnyData[currentIdx];

  // Motion animation variants for Tinder slide effect
  const cardVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      rotate: dir === 'right' ? 10 : -10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -200 : 200,
      opacity: 0,
      scale: 0.95,
      rotate: dir === 'right' ? -10 : 10,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div id="chaos-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          The Chaos Engine
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Our Chaos <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
        </h1>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          Embarrassing pictures, silly complaints, and the beautiful mess of being together.
        </p>
      </div>

      {/* Card Shuffler Stage */}
      <div className="relative h-96 w-full flex items-center justify-center mb-6">
        <AnimatePresence mode="wait" custom={direction}>
          {currentCard && (
            <motion.div
              key={currentCard.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
            >
              {/* Photo Box with overlay gradient */}
              <div className="relative w-full h-56 bg-zinc-950 overflow-hidden">
                <img
                  src={currentCard.image}
                  alt={currentCard.text}
                  className="w-full h-full object-cover transform hover:rotate-1 hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
                
                {/* Title badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/5 border border-amber-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Silly Memory
                  </span>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight mt-1">
                    {currentCard.text}
                  </h3>
                </div>
              </div>

              {/* Description Content */}
              <div className="p-5 flex-grow flex items-center justify-center bg-zinc-900/60">
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-light italic text-center">
                  "{currentCard.caption}"
                </p>
              </div>

              {/* Funny Footer Deco */}
              <div className="px-5 pb-4 border-t border-white/5 pt-3 bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <MessageSquareDashed className="w-3.5 h-3.5 text-zinc-600" />
                  Leo's Version
                </span>
                <span>
                  Laugh #{currentCard.id}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controller Buttons */}
      <div className="flex flex-col gap-3 items-center w-full">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShuffle}
          className="w-full py-4 bg-linear-to-r from-amber-500 to-brand-pink text-white rounded-2xl font-display font-semibold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 cursor-pointer group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Give Me Another Laugh 😂
        </motion.button>
        
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Click button to draw another card
        </p>
      </div>

    </div>
  );
}
