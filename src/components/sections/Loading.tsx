import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface LoadingProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  "Finding our memories...",
  "Loading smiles...",
  "Looking for embarrassing photos...",
  "Counting hugs...",
  "Almost there...",
  "Welcome ❤️"
];

export default function Loading({ onComplete }: LoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress incrementor
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 3 seconds total (100 * 30ms = 3000ms)

    // Step text iterator
    const stepDuration = 3000 / (LOADING_STEPS.length - 1);
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, stepDuration);

    // Complete trigger
    const timeout = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div id="loading-container" className="w-full h-screen bg-bg-dark flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs flex flex-col items-center gap-10">
        
        {/* Glowing Heart Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
            filter: [
              "drop-shadow(0 0 10px rgba(255, 92, 138, 0.5))",
              "drop-shadow(0 0 25px rgba(255, 92, 138, 0.8))",
              "drop-shadow(0 0 10px rgba(255, 92, 138, 0.5))"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-brand-pink"
        >
          <Heart className="w-16 h-16 fill-brand-pink" />
        </motion.div>

        {/* Nostalgic Messages */}
        <div className="h-16 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="font-display text-lg md:text-xl font-medium tracking-wide text-zinc-200"
            >
              {LOADING_STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Elegant Minimal Progress Bar */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            className="h-full bg-linear-to-r from-brand-pink to-brand-purple rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Quantitative Indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs text-zinc-500 uppercase tracking-widest"
        >
          Syncing Hearts {Math.min(Math.floor(progress), 100)}%
        </motion.p>

      </div>
    </div>
  );
}
