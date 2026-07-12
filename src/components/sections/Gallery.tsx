import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Maximize2, Play, X, ChevronRight, ZoomIn, ZoomOut, Film, Camera } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryProps {
  galleryData: GalleryItem[];
  onBack: () => void;
}

type TabType = 'all' | 'images' | 'videos';

export default function Gallery({ galleryData, onBack }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Touch swipe coordinates
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter items
  const filteredData = galleryData.filter((item) => {
    if (activeTab === 'images') return item.type === 'image';
    if (activeTab === 'videos') return item.type === 'video';
    return true;
  });

  const handleOpenViewer = (item: GalleryItem) => {
    const indexInFiltered = filteredData.findIndex((i) => i.id === item.id);
    if (indexInFiltered !== -1) {
      setSelectedIdx(indexInFiltered);
      setIsZoomed(false);
    }
  };

  const handleCloseViewer = () => {
    setSelectedIdx(null);
    setIsZoomed(false);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev !== null && prev < filteredData.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredData.length - 1));
    setIsZoomed(false);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0) {
        // Swipe left -> Next
        handleNext();
      } else {
        // Swipe right -> Prev
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div id="gallery-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Memory Vault
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Our Captures</h1>
        <p className="text-zinc-400 text-sm mt-1 font-light">Frozen frames of our happiest and funniest days.</p>
      </div>

      {/* Custom Tab Filter pills */}
      <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-xl border border-white/5">
        {(['all', 'images', 'videos'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-zinc-900 text-brand-pink font-semibold border border-white/5 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pinterest Masonry Columns */}
      <div className="columns-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid mb-3 relative group rounded-xl overflow-hidden border border-white/5 cursor-pointer bg-zinc-900/40"
              onClick={() => handleOpenViewer(item)}
            >
              {item.type === 'image' ? (
                <div className={`${item.aspectClass || 'aspect-square'} w-full overflow-hidden bg-zinc-950`}>
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Camera Indicator */}
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-400">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className={`${item.aspectClass || 'aspect-[16/9]'} w-full overflow-hidden bg-zinc-950 relative`}>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                  {/* Play video cover overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-brand-pink/90 text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,92,138,0.3)]">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                  {/* Subtle Video Camera Indicator */}
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-400">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Caption Overlay on hover */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[11px] text-zinc-200 line-clamp-2 leading-relaxed font-light">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-xs font-mono">No captures in this vault category.</p>
        </div>
      )}

      {/* FULLSCREEN ZOOM SWIPE VIEWER */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between py-6 px-4 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleCloseViewer}
          >
            {/* Viewer Header */}
            <div className="w-full flex items-center justify-between px-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-mono text-zinc-500">
                {selectedIdx + 1} / {filteredData.length}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Zoom Toggle (Images Only) */}
                {filteredData[selectedIdx].type === 'image' && (
                  <button
                    onClick={toggleZoom}
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 active:scale-95 cursor-pointer"
                  >
                    {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={handleCloseViewer}
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Stage / Media */}
            <div className="w-full flex-grow flex items-center justify-center relative overflow-hidden my-4">
              
              {/* Desktop Next/Prev Floating Arrows */}
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute left-4 z-10 w-12 h-12 rounded-full bg-zinc-900/60 hover:bg-zinc-850 text-white items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={handleNext}
                className="hidden md:flex absolute right-4 z-10 w-12 h-12 rounded-full bg-zinc-900/60 hover:bg-zinc-850 text-white items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Core Media Element */}
              <div className="max-w-full max-h-full flex items-center justify-center p-2">
                {filteredData[selectedIdx].type === 'image' ? (
                  <img
                    src={filteredData[selectedIdx].url}
                    alt={filteredData[selectedIdx].caption}
                    onClick={toggleZoom}
                    className={`max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 ${
                      isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video
                    src={filteredData[selectedIdx].url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>

            </div>

            {/* Viewer Bottom Caption Panel */}
            <div
              className="w-full max-w-sm glass-panel p-4 rounded-2xl border border-white/10 text-center mx-auto mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs text-zinc-200 leading-relaxed font-light">
                {filteredData[selectedIdx].caption}
              </p>
              
              {/* Swipe/Control Tip */}
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-2 select-none">
                ← Swipe Left or Right to flip →
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
