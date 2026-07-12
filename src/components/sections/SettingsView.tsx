import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, RotateCcw, Heart, Calendar, Type, Music, Palette } from 'lucide-react';
import { AppSettings } from '../../types';
import originalSettings from '../../data/settings.json';

interface SettingsViewProps {
  settings: AppSettings;
  onSave: (updated: AppSettings) => void;
  onBack: () => void;
}

const PRESET_ACCENTS = [
  { name: "Hot Pink", value: "#FF5C8A" },
  { name: "Sunset Amber", value: "#F59E0B" },
  { name: "Rose Quartz", value: "#F472B6" },
  { name: "Orchid Purple", value: "#A855F7" },
  { name: "Coral Bliss", value: "#FB7185" }
];

const PRESET_TUNES = [
  { name: "Love Is All Around Us (Mixkit)", value: "https://assets.mixkit.co/music/preview/mixkit-love-is-all-around-us-1215.mp3" },
  { name: "Acoustic Walk (Mixkit)", value: "https://assets.mixkit.co/music/preview/mixkit-acoustic-walk-1211.mp3" },
  { name: "Serene Piano (Mixkit)", value: "https://assets.mixkit.co/music/preview/mixkit-serene-piano-967.mp3" }
];

export default function SettingsView({ settings, onSave, onBack }: SettingsViewProps) {
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [names, setNames] = useState(settings.names);
  const [startDate, setStartDate] = useState(settings.relationshipStartDate);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [bgMusic, setBgMusic] = useState(settings.bgMusic);
  const [romanticQuote, setRomanticQuote] = useState(settings.themeValues.romanticQuote);

  const handleSave = () => {
    const updated: AppSettings = {
      siteTitle,
      names,
      relationshipStartDate: startDate,
      accentColor,
      bgMusic,
      themeValues: {
        fontDisplay: "Outfit",
        romanticQuote
      }
    };
    onSave(updated);
  };

  const handleReset = () => {
    setSiteTitle(originalSettings.siteTitle);
    setNames(originalSettings.names);
    setStartDate(originalSettings.relationshipStartDate);
    setAccentColor(originalSettings.accentColor);
    setBgMusic(originalSettings.bgMusic);
    setRomanticQuote(originalSettings.themeValues.romanticQuote);
  };

  return (
    <div id="settings-view" className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 py-1.5 px-3 rounded-full hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Control Panel
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Customizer</h1>
        <p className="text-zinc-400 text-sm mt-1 font-light">
          Adapt names, dates, quotes, colors, and audio tracks to match your own memories.
        </p>
      </div>

      {/* Settings Input Grid */}
      <div className="flex flex-col gap-5 bg-zinc-900/20 p-5 rounded-3xl border border-white/5 mb-6">
        
        {/* Input: Names */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" /> Couple Names
          </label>
          <input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="e.g. Leo & Maya"
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:border-brand-pink/30 transition-colors"
          />
        </div>

        {/* Input: Site Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Type className="w-3 h-3 text-brand-pink" /> Website Header Title
          </label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="e.g. 730 Days, Infinite Memories"
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:border-brand-pink/30 transition-colors"
          />
        </div>

        {/* Input: Relationship Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-pink" /> Anniversary Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-100 focus:outline-hidden focus:border-brand-pink/30 transition-colors"
          />
          <p className="text-[10px] text-zinc-600 font-mono italic">
            This will automatically recalculate the active days countdown clock.
          </p>
        </div>

        {/* Color Accent Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Palette className="w-3 h-3 text-brand-pink" /> Custom Theme Accent
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_ACCENTS.map((preset) => {
              const isActive = accentColor === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => setAccentColor(preset.value)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-white font-bold border-white/25 shadow-md'
                      : 'bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"
                    style={{ backgroundColor: preset.value }}
                  />
                  {preset.name}
                </button>
              );
            })}
          </div>
          {/* Custom Hex Color Input */}
          <input
            type="text"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            placeholder="#FF5C8A"
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 font-mono mt-1"
          />
        </div>

        {/* Input: Background Music */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Music className="w-3 h-3 text-brand-pink" /> Background Audio Stream
          </label>
          <div className="flex flex-col gap-1.5">
            {PRESET_TUNES.map((preset) => {
              const isActive = bgMusic === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => setBgMusic(preset.value)}
                  className={`w-full p-3 border rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-pink/5 border-brand-pink/20 text-brand-pink font-semibold'
                      : 'bg-zinc-950/40 border-white/5 text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
          {/* Custom URL Input */}
          <input
            type="text"
            value={bgMusic}
            onChange={(e) => setBgMusic(e.target.value)}
            placeholder="Paste your own MP3 URL"
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-300 font-mono mt-1"
          />
        </div>

        {/* Input: Romantic Quote */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Heart className="w-3 h-3 text-brand-pink" /> Footer Love Quote
          </label>
          <textarea
            value={romanticQuote}
            onChange={(e) => setRomanticQuote(e.target.value)}
            rows={3}
            placeholder="Write a sweet, customized dedication quote..."
            className="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-700 focus:outline-hidden focus:border-brand-pink/30 transition-colors resize-none leading-relaxed"
          />
        </div>

      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full py-4 bg-white text-zinc-950 font-display font-semibold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-100"
        >
          <Save className="w-4 h-4 text-brand-pink" /> Save and Apply Changes 💾
        </motion.button>

        <button
          onClick={handleReset}
          className="w-full py-3.5 bg-zinc-950 text-zinc-500 border border-white/5 font-mono text-[10px] uppercase tracking-widest rounded-2xl cursor-pointer hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Defaults
        </button>
      </div>

    </div>
  );
}
