import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Feather, RotateCcw, Flame } from 'lucide-react';

interface ForYouProps {
  letterData: string[];
  onBack: () => void;
}

export default function ForYou({ letterData, onBack }: ForYouProps) {
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [currentParaIdx, setCurrentParaIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDone, setIsDone] = useState(false);
  
  const letterEndRef = useRef<HTMLDivElement>(null);

  // Skip feature
  const handleSkip = () => {
    setDisplayedParagraphs(letterData);
    setIsDone(true);
    setCurrentText("");
  };

  const handleRestart = () => {
    setDisplayedParagraphs([]);
    setCurrentParaIdx(0);
    setCurrentText("");
    setIsDone(false);
  };

  useEffect(() => {
    if (isDone) return;
    if (currentParaIdx >= letterData.length) {
      setIsDone(true);
      return;
    }

    const fullText = letterData[currentParaIdx];
    let charIdx = 0;
    
    // Type out the paragraph
    const typingTimer = setInterval(() => {
      if (charIdx < fullText.length) {
        setCurrentText((prev) => prev + fullText.charAt(charIdx));
        charIdx++;
        
        // Auto scroll letter bottom into view
        if (charIdx % 10 === 0) {
          letterEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        clearInterval(typingTimer);
        
        // Append completed paragraph to displayed array
        setDisplayedParagraphs((prev) => [...prev, fullText]);
        setCurrentText("");
        
        // Move to next paragraph
        setCurrentParaIdx((prev) => prev + 1);
      }
    }, 15); // Quick typing speed (15ms per character)

    return () => clearInterval(typingTimer);
  }, [currentParaIdx, isDone, letterData]);

  return (
    <div id="for-you-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Personal Envelope
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          For Your Eyes Only <Feather className="w-5 h-5 text-brand-pink" />
        </h1>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          A personal, handwritten note from Leo's heart directly to yours.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex justify-between gap-2 mb-4">
        {!isDone ? (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-[10px] font-mono text-brand-pink uppercase tracking-widest bg-brand-pink/5 border border-brand-pink/10 py-1 px-3 rounded-md active:scale-95 cursor-pointer"
          >
            Skip Typewriter ⚡
          </button>
        ) : (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1 px-3 rounded-md active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Replay Letter
          </button>
        )}
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest self-center">
          {isDone ? "Unsealed" : "Unfolding..."}
        </span>
      </div>

      {/* VINTAGE HANDWRITTEN PAPER BOX */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[#FCFBF7] rounded-3xl p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] text-zinc-800 font-handwritten relative overflow-hidden select-text"
        style={{
          backgroundImage: 'repeating-linear-gradient(#FCFBF7, #FCFBF7 31px, #E5E3DB 31px, #E5E3DB 32px)',
          lineHeight: '32px',
          paddingTop: '36px'
        }}
      >
        {/* Pink notebook vertical left margin line */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-red-200/50 pointer-events-none" />

        <div className="pl-6 select-text">
          {/* Paragraph list */}
          <div className="flex flex-col gap-6 select-text text-lg md:text-xl font-normal leading-[32px]">
            {displayedParagraphs.map((para, idx) => {
              // Specific formatting for top salutation and bottom signature to look beautifully aligned
              const isFirst = idx === 0;
              const isLast = idx === displayedParagraphs.length - 1;
              const isPenultimate = idx === displayedParagraphs.length - 2;

              return (
                <p
                  key={idx}
                  className={`select-text ${isFirst ? 'font-bold text-2xl tracking-wide text-zinc-900 border-b border-zinc-200/40 pb-2 mb-2' : ''} ${
                    isLast ? 'text-right font-bold text-2xl text-brand-pink' : ''
                  } ${isPenultimate ? 'text-right italic text-zinc-500 text-sm font-mono tracking-wider' : ''}`}
                >
                  {para}
                </p>
              );
            })}

            {/* Current Active Typewriter Line */}
            {currentText && (
              <p className={`select-text text-zinc-700 font-medium typing-cursor ${currentParaIdx === 0 ? 'text-2xl font-bold text-zinc-900' : ''}`}>
                {currentText}
              </p>
            )}
          </div>

          {/* Red Wax Seal Anchor */}
          <AnimatePresence>
            {isDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 0.5, stiffness: 120 }}
                className="w-full flex justify-end mt-8 pr-4"
              >
                <div className="flex flex-col items-center select-none">
                  {/* Digital wax seal */}
                  <div className="w-14 h-14 rounded-full bg-red-600 border-4 border-red-700 flex items-center justify-center text-white shadow-md relative group rotate-12 select-none">
                    {/* Melty wax outer circles */}
                    <div className="absolute inset-0 rounded-full border border-red-500 scale-105 opacity-50" />
                    <div className="absolute -inset-1 rounded-full bg-red-600/20 scale-110 pointer-events-none" />
                    <Flame className="w-6 h-6 fill-red-200 text-red-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-widest leading-none rotate-3">
                    Wax Sealed
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Anchor to scroll bottom into view */}
          <div ref={letterEndRef} className="h-6" />
        </div>
      </motion.div>

      {/* Quick visual details */}
      <div className="text-center mt-6">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" /> Scrolls smoothly into your memory bank
        </p>
      </div>

    </div>
  );
}
