import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingSceneProps {
  onComplete: () => void;
}

export default function LoadingScene({ onComplete }: LoadingSceneProps) {
  const [loadStep, setLoadStep] = useState(0);
  const loadingTexts = [
    'Finding memories...',
    'Loading smiles...',
    'Counting hugs...',
    'Finding embarrassing photos...',
    'Almost there...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadStep((prev) => {
        if (prev < loadingTexts.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          onComplete();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="scene-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(15px)' }}
      transition={{ duration: 0.6 }}
      className="px-8 text-center max-w-xs space-y-6 flex flex-col items-center justify-center h-full"
    >
      <div className="h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-brand-pink rounded-full"
        />
      </div>

      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={loadStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400"
          >
            {loadingTexts[loadStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
