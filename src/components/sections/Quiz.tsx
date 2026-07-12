import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, XCircle, Award, RefreshCw, ChevronRight, Heart } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizProps {
  quizData: QuizQuestion[];
  onBack: () => void;
}

export default function Quiz({ quizData, onBack }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (optIdx: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(optIdx);
    
    if (optIdx === quizData[currentIdx].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
  };

  const getEvaluation = () => {
    const pct = (score / quizData.length) * 100;
    if (pct === 100) return { title: "Soulmate Level: Perfect! 💖", desc: "You two know each other inside out. Absolutely flawless synergy!" };
    if (pct >= 80) return { title: "Certified Sweethearts! 💞", desc: "You have an incredible bond. Almost perfect, with just minor details left to discover!" };
    if (pct >= 50) return { title: "Adorable Couple! 💓", desc: "Great job! You know the core of each other's souls, but still have fun little trivia to learn." };
    return { title: "Cuddle Study-Session Needed! 😘", desc: "Uh oh! Perfect excuse to lock the doors, cuddle up, and talk about yourselves all night long." };
  };

  const currentQuestion = quizData[currentIdx];
  const progressPercent = ((currentIdx) / quizData.length) * 100;

  return (
    <div id="quiz-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Relationship Trivia
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Progress Header & Track */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end text-xs font-mono uppercase tracking-widest text-zinc-500">
                <span>Question {currentIdx + 1} of {quizData.length}</span>
                <span className="text-brand-pink font-semibold">{score} Correct</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-linear-to-r from-brand-pink to-brand-purple rounded-full"
                  initial={{ width: `${progressPercent}%` }}
                  animate={{ width: `${((currentIdx + 1) / quizData.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-zinc-900/20">
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-brand-pink/5 rounded-full blur-xl pointer-events-none" />
              
              <span className="text-[10px] font-mono text-brand-pink bg-brand-pink/5 border border-brand-pink/10 px-2 py-0.5 rounded-full uppercase tracking-wider mb-3.5 inline-block">
                True Connection
              </span>

              <h2 className="font-display text-xl font-bold text-white tracking-tight leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                const hasSelected = selectedOption !== null;

                let btnStyles = "bg-zinc-900/40 border-white/5 text-zinc-200 hover:bg-zinc-800/40";
                let icon = null;

                if (hasSelected) {
                  if (isCorrect) {
                    btnStyles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium";
                    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                  } else if (isSelected) {
                    btnStyles = "bg-red-500/10 border-red-500/30 text-red-300 font-medium";
                    icon = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
                  } else {
                    btnStyles = "bg-zinc-900/10 border-zinc-950/40 text-zinc-600 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSelected}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 border rounded-2xl flex items-center justify-between text-left text-xs md:text-sm leading-relaxed transition-all duration-300 ${btnStyles} ${
                      !hasSelected ? 'active:scale-98 cursor-pointer' : ''
                    }`}
                  >
                    <span className="flex-grow">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Slide Down Explanation Alert */}
            <AnimatePresence>
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-panel p-4 rounded-2xl border-l-4 border-l-brand-pink border-white/5 bg-zinc-900/60 flex flex-col gap-1"
                >
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    The Inside Scoop:
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Button */}
            {selectedOption !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full py-4 bg-white text-zinc-950 font-display font-semibold text-sm rounded-2xl shadow-md hover:bg-zinc-100 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {currentIdx < quizData.length - 1 ? (
                  <>Next Question <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>See Final Score <Award className="w-4 h-4 text-brand-pink" /></>
                )}
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* SCOREBOARD OVERLAY VIEW */
          <motion.div
            key="scoreboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-3xl border border-white/10 text-center flex flex-col gap-6 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-pink/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Award Ring Graphic */}
            <div className="mx-auto w-24 h-24 rounded-full bg-brand-pink/5 border-2 border-dashed border-brand-pink/30 flex items-center justify-center relative my-2">
              <span className="absolute inset-2 bg-brand-pink/10 rounded-full animate-pulse" />
              <div className="relative flex flex-col items-center">
                <span className="font-display text-3xl font-extrabold text-white">
                  {score}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  / {quizData.length}
                </span>
              </div>
            </div>

            {/* Grade Badge */}
            <div className="flex flex-col gap-1.5 px-2">
              <h2 className="font-display text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-brand-pink to-brand-purple tracking-tight leading-snug">
                {getEvaluation().title}
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light px-4">
                {getEvaluation().desc}
              </p>
            </div>

            {/* Score Message Decos */}
            <div className="bg-zinc-950/50 py-3.5 px-4 rounded-2xl border border-white/5 flex justify-around text-center">
              <div>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Correct</p>
                <p className="font-display text-lg font-bold text-emerald-400 mt-1">{score}</p>
              </div>
              <div className="border-r border-white/5 h-8 my-auto" />
              <div>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Missed</p>
                <p className="font-display text-lg font-bold text-red-400 mt-1">{quizData.length - score}</p>
              </div>
              <div className="border-r border-white/5 h-8 my-auto" />
              <div>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Rating</p>
                <p className="font-display text-lg font-bold text-purple-400 mt-1">
                  {Math.round((score / quizData.length) * 100)}%
                </p>
              </div>
            </div>

            {/* Play Again Trigger */}
            <div className="flex flex-col gap-2.5">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="w-full py-4 bg-white text-zinc-950 font-display font-semibold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again Together
              </motion.button>
              
              <button
                onClick={onBack}
                className="w-full py-3.5 bg-zinc-900 text-zinc-400 border border-white/5 font-display text-xs rounded-2xl cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                Return to Memories Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
