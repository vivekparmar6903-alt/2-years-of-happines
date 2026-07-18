import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Image, 
  Sparkles, 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Save, 
  Play, 
  Layers
} from 'lucide-react';
import { AppSettings, TimelineItem, GalleryItem, FunnyCard } from '../types';

interface EditorPanelProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  timeline: TimelineItem[];
  setTimeline: (t: TimelineItem[]) => void;
  gallery: GalleryItem[];
  setGallery: (g: GalleryItem[]) => void;
  funny: FunnyCard[];
  setFunny: (f: FunnyCard[]) => void;
  letter: string[];
  setLetter: (l: string[]) => void;
  onResetAll: () => void;
  sceneIndex: number;
  setSceneIndex: (i: number) => void;
}

export default function EditorPanel({
  settings,
  setSettings,
  timeline,
  setTimeline,
  gallery,
  setGallery,
  funny,
  setFunny,
  letter,
  setLetter,
  onResetAll,
  sceneIndex,
  setSceneIndex
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'timeline' | 'gallery' | 'funny' | 'letter' | 'export'>('general');

  // Generic settings savers
  const updateSetting = (key: keyof AppSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('anniversary_app_settings', JSON.stringify(updated));
  };

  const saveTimeline = (newTimeline: TimelineItem[]) => {
    setTimeline(newTimeline);
    localStorage.setItem('anniversary_timeline', JSON.stringify(newTimeline));
  };

  const saveGallery = (newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    localStorage.setItem('anniversary_gallery', JSON.stringify(newGallery));
  };

  const saveFunny = (newFunny: FunnyCard[]) => {
    setFunny(newFunny);
    localStorage.setItem('anniversary_funny', JSON.stringify(newFunny));
  };

  const saveLetter = (newL: string[]) => {
    setLetter(newL);
    localStorage.setItem('anniversary_letter', JSON.stringify(newL));
  };

  // Add & Delete Helpers
  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: `t_${Date.now()}`,
      title: 'New Sweet Memory',
      date: 'July 2026',
      description: 'Describe this beautiful milestone here.',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
      location: 'Paris',
      quote: 'A special words spoken here.'
    };
    saveTimeline([...timeline, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    const updated = timeline.filter((_, i) => i !== index);
    saveTimeline(updated);
  };

  const updateTimelineItem = (index: number, key: keyof TimelineItem, value: any) => {
    const updated = timeline.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    saveTimeline(updated);
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `g_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      type: 'image',
      caption: 'A stunning captured glance.'
    };
    saveGallery([...gallery, newItem]);
  };

  const removeGalleryItem = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    saveGallery(updated);
  };

  const updateGalleryItem = (index: number, key: keyof GalleryItem, value: any) => {
    const updated = gallery.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    saveGallery(updated);
  };

  const addFunnyItem = () => {
    const newItem: FunnyCard = {
      id: `f_${Date.now()}`,
      text: 'Funny Inside Joke text',
      image: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=1200&auto=format&fit=crop',
      caption: 'The story behind the laughs.'
    };
    saveFunny([...funny, newItem]);
  };

  const removeFunnyItem = (index: number) => {
    const updated = funny.filter((_, i) => i !== index);
    saveFunny(updated);
  };

  const updateFunnyItem = (index: number, key: keyof FunnyCard, value: any) => {
    const updated = funny.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    saveFunny(updated);
  };

  const updateLetterLine = (index: number, value: string) => {
    const updated = [...letter];
    updated[index] = value;
    saveLetter(updated);
  };

  const addLetterLine = () => {
    saveLetter([...letter, '']);
  };

  const removeLetterLine = (index: number) => {
    const updated = letter.filter((_, i) => i !== index);
    saveLetter(updated);
  };

  // Downloading separate files
  const downloadJSON = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-[480px] bg-zinc-950 border-r border-zinc-800 flex flex-col h-full text-zinc-100 font-sans relative z-30 select-text overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(255,92,138,0.6)] animate-pulse" />
            <h1 className="text-md font-semibold tracking-tight font-display text-white">
              730 Cinematic Studio
            </h1>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Perfecting your dynamic story live on screen.
          </p>
        </div>

        <button
          onClick={onResetAll}
          className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
          title="Reset to Factory Defaults"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Navigation */}
      <div className="flex border-b border-zinc-900 bg-zinc-950 px-2 pt-1 gap-1">
        {[
          { id: 'general', icon: <Settings className="w-3.5 h-3.5" />, label: 'General' },
          { id: 'timeline', icon: <Clock className="w-3.5 h-3.5" />, label: 'Timeline' },
          { id: 'gallery', icon: <Image className="w-3.5 h-3.5" />, label: 'Gallery' },
          { id: 'funny', icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Laughs' },
          { id: 'letter', icon: <FileText className="w-3.5 h-3.5" />, label: 'Letter' },
          { id: 'export', icon: <Download className="w-3.5 h-3.5" />, label: 'Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-brand-pink text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content scrolling workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none bg-zinc-950">
        
        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === 'general' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              General Story Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Couple Names
                </label>
                <input
                  type="text"
                  value={settings.names}
                  onChange={(e) => updateSetting('names', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                  placeholder="Leo & Maya"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Anniversary Date
                </label>
                <input
                  type="date"
                  value={settings.relationshipStartDate}
                  onChange={(e) => updateSetting('relationshipStartDate', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Soundtrack (Direct MP3 Link)
                </label>
                <input
                  type="text"
                  value={settings.bgMusic}
                  onChange={(e) => updateSetting('bgMusic', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Recommending Erik Satie, Chopin, or gentle lofi. Must be a direct raw MP3 URL.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Accent Hex Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border border-zinc-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-2">
              <h4 className="text-xs font-semibold text-zinc-300">Quick Scene Director</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Click any chapter cover index below to jump straight to it on the simulated phone:
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { label: 'Intro (0)', index: 0 },
                  { label: 'Chapter I (2)', index: 2 },
                  { label: 'Chapter II (9)', index: 9 },
                  { label: 'Chapter III (18)', index: 18 },
                  { label: 'Chapter IV (24)', index: 24 },
                  { label: 'Chapter V (26)', index: 26 },
                  { label: 'Final Card (31)', index: 31 },
                ].map((scene) => (
                  <button
                    key={scene.index}
                    onClick={() => setSceneIndex(scene.index)}
                    className="p-1.5 text-[10px] font-mono bg-zinc-900 hover:bg-zinc-800 rounded text-zinc-300 border border-zinc-800 hover:text-white transition-all cursor-pointer text-center"
                  >
                    {scene.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TIMELINE TAB ==================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Timeline Memories ({timeline.length})
              </h3>
              <button
                onClick={addTimelineItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Memory
              </button>
            </div>

            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3 relative group">
                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => removeTimelineItem(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                    Memory #{idx + 1}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Date / Tag</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateTimelineItem(idx, 'date', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelineItem(idx, 'title', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Image URL</label>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateTimelineItem(idx, 'image', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Caption/Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateTimelineItem(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Special Quote (Optional)</label>
                    <input
                      type="text"
                      value={item.quote}
                      onChange={(e) => updateTimelineItem(idx, 'quote', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== GALLERY TAB ==================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Gallery Slides ({gallery.length})
              </h3>
              <button
                onClick={addGalleryItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {gallery.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3 relative group">
                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => removeGalleryItem(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                    Gallery Slide #{idx + 1}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Media Type</label>
                      <select
                        value={item.type}
                        onChange={(e) => updateGalleryItem(idx, 'type', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <p className="text-[9px] text-zinc-500 leading-relaxed">
                        Videos must be raw .mp4/.webm.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Media URL</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateGalleryItem(idx, 'url', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Caption Phrase</label>
                    <textarea
                      value={item.caption}
                      onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== FUNNY TAB ==================== */}
        {activeTab === 'funny' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Giggles & Inside Jokes ({funny.length})
              </h3>
              <button
                onClick={addFunnyItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Laugh
              </button>
            </div>

            <div className="space-y-4">
              {funny.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3 relative group">
                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => removeFunnyItem(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer"
                      title="Delete Joke"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                    Inside Joke #{idx + 1}
                  </span>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Punchline Title</label>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateFunnyItem(idx, 'text', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Image URL</label>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateFunnyItem(idx, 'image', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Sub-caption Details</label>
                    <textarea
                      value={item.caption}
                      onChange={(e) => updateFunnyItem(idx, 'caption', e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== LETTER TAB ==================== */}
        {activeTab === 'letter' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Love Letter Paragraphs ({letter.length})
              </h3>
              <button
                onClick={addLetterLine}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Paragraph
              </button>
            </div>

            <div className="space-y-4">
              {letter.map((line, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2 relative group">
                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => removeLetterLine(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer"
                      title="Delete Line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                    Paragraph {idx + 1} {idx === 0 ? '(Greeting / Hook)' : idx === letter.length - 1 ? '(Signature)' : ''}
                  </span>

                  <textarea
                    value={line}
                    onChange={(e) => updateLetterLine(idx, e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-serif leading-relaxed"
                    placeholder="Type words from your heart..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== EXPORT TAB ==================== */}
        {activeTab === 'export' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Export / Save Project
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Your edits are automatically saved to your browser's <code className="text-zinc-300 font-mono text-[10px] bg-zinc-900 px-1 py-0.5 rounded">localStorage</code>. 
              To make them permanent in your code, download these JSON files and replace the contents inside the <code className="text-zinc-300 font-mono text-[10px] bg-zinc-900 px-1 py-0.5 rounded">/src/data/</code> folder!
            </p>

            <div className="flex flex-col gap-3.5 pt-2">
              <button
                onClick={() => downloadJSON('settings.json', settings)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">settings.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Couples names, start date, mp3 music URL.</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('timeline.json', timeline)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">timeline.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Sweet memories chapters list ({timeline.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('gallery.json', gallery)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">gallery.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Captioned video/photo slide assets ({gallery.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('funny.json', funny)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">funny.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Inside giggles, punchlines, image arrays ({funny.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('letter.json', letter)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">letter.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Full paragraph signature letter array.</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
