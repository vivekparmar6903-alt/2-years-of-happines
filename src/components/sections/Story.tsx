import { motion } from 'motion/react';
import { MapPin, Quote, ChevronLeft, Calendar } from 'lucide-react';
import { TimelineItem } from '../../types';

interface StoryProps {
  timelineData: TimelineItem[];
  onBack: () => void;
}

export default function Story({ timelineData, onBack }: StoryProps) {
  // Sort timeline by chronological date (implied order from JSON is fine as well)
  return (
    <div id="timeline-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Chapter Timeline
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Our Love Story</h1>
        <p className="text-zinc-400 text-sm mt-1 font-light">The beautiful steps that led us to where we are today.</p>
      </div>

      {/* Vertical Mobile Timeline Track */}
      <div className="relative pl-6 border-l border-zinc-800 ml-3 flex flex-col gap-10 py-2">
        {timelineData.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-bg-dark border-2 border-brand-pink flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-ping absolute" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            </div>

            {/* Timeline Date Header */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-brand-pink font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
              {item.tag && (
                <span className="text-[9px] text-zinc-400 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-full uppercase ml-1.5">
                  {item.tag}
                </span>
              )}
            </div>

            {/* Elegant Story Card */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-zinc-900/40">
              
              {/* Photo */}
              <div className="relative w-full h-44 overflow-hidden bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Title Overlay */}
                <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>
              </div>

              {/* Story Content */}
              <div className="p-4 flex flex-col gap-3.5">
                
                {/* Description */}
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Romantic Custom Quote Panel */}
                <div className="p-3 bg-zinc-950/40 border-l-2 border-brand-pink rounded-r-xl flex gap-2">
                  <Quote className="w-4 h-4 text-brand-pink/50 shrink-0 mt-0.5" />
                  <p className="text-xs italic text-zinc-400 leading-relaxed font-light">
                    {item.quote}
                  </p>
                </div>

                {/* Location Capsule */}
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1 border-t border-white/5 pt-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                  {item.location}
                </div>

              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom spacer for safe scroll padding */}
      <div className="text-center mt-12 mb-6">
        <p className="text-xs font-mono text-zinc-600">To be continued...</p>
        <span className="inline-block w-1.5 h-1.5 bg-brand-pink rounded-full mt-2 animate-bounce" />
      </div>

    </div>
  );
}
