import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Layers,
  Upload,
  AlertCircle,
  Check,
  Compass,
  X
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase';
import { AppSettings, TimelineItem, GalleryItem, FunnyCard, BucketListItem } from '../types';

interface ImageDropZoneProps {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
}

function ImageDropZone({ value, onChange, label }: ImageDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    
    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setWarning('This file is larger than 10MB.');
    } else {
      setWarning(null);
    }

    if (storage) {
      try {
        setIsUploading(true);
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storageRef = ref(storage, `photos/${Date.now()}_${cleanName}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        onChange(downloadUrl);
        setIsUploading(false);
        return;
      } catch (err) {
        console.warn('Firebase Storage upload failed, falling back to data URL:', err);
        setIsUploading(false);
      }
    }

    // Fallback to Base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const isBase64 = value && value.startsWith('data:');
  const isCloudUrl = value && (value.includes('firebasestorage.googleapis.com') || value.includes('storage.googleapis.com'));

  return (
    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <label className="block text-[8px] font-mono uppercase text-zinc-500">{label}</label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer text-center group ${
          isDragActive 
            ? 'border-brand-pink bg-brand-pink/5' 
            : 'border-zinc-800 hover:border-brand-pink/50 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {isUploading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-brand-pink">
            <RefreshCw className="w-5 h-5 animate-spin text-brand-pink" />
            <span className="text-[10px] font-mono">Uploading to Cloud Storage...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-24 rounded overflow-hidden mb-2 bg-black/40 border border-zinc-800">
            {value.includes('video') || value.endsWith('.mp4') || value.endsWith('.webm') ? (
              <video 
                src={value} 
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[10px] font-medium text-white gap-1">
              <Upload className="w-3.5 h-3.5 text-brand-pink" />
              <span>Replace Media</span>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center justify-center gap-1.5 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <Upload className="w-5 h-5 text-zinc-500 group-hover:text-brand-pink transition-colors" />
            <span className="text-[10px] font-medium">Drag file here, or click to browse</span>
          </div>
        )}

        <div className="w-full px-1 flex flex-col gap-1 text-[8px] text-zinc-500 font-mono">
          {!isDragActive && !isUploading && (
            <span className="text-zinc-600 block truncate max-w-full">
              {isCloudUrl ? '☁️ Firebase Cloud Media' : isBase64 ? 'Embedded base64 media' : (value ? value : 'No media uploaded')}
            </span>
          )}
          {isDragActive && <span className="text-brand-pink font-bold">Drop it here!</span>}
        </div>
      </div>

      <div className="flex gap-1.5 items-center">
        <input
          type="text"
          value={isBase64 ? 'Embedded Base64 Media' : value}
          disabled={isBase64}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste direct media URL..."
          onClick={(e) => e.stopPropagation()}
          className="flex-grow bg-zinc-900/40 text-[9px] border border-zinc-800 rounded px-2 py-1 text-zinc-400 focus:outline-none focus:border-brand-pink/50 disabled:opacity-50 disabled:cursor-not-allowed font-mono truncate"
        />
        {isBase64 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-[8px] font-mono text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-1 rounded hover:bg-red-400/20 transition-all cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {warning && (
        <div className="flex items-start gap-1.5 text-[9px] text-amber-400 bg-amber-400/5 border border-amber-400/10 p-2 rounded leading-normal">
          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
}

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
  future: BucketListItem[];
  setFuture: (f: BucketListItem[]) => void;
  onSaveStory: (updates: Partial<{
    settings: AppSettings;
    timeline: TimelineItem[];
    gallery: GalleryItem[];
    funny: FunnyCard[];
    letter: string[];
    future: BucketListItem[];
  }>) => void;
  saveStatus: 'saved' | 'saving' | 'error' | 'idle';
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
  future,
  setFuture,
  onSaveStory,
  saveStatus,
  onResetAll,
  sceneIndex,
  setSceneIndex
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'timeline' | 'gallery' | 'funny' | 'letter' | 'future' | 'export'>('general');

  // Local draft state — typing only updates draft state, not Firestore on every keystroke
  const [draftSettings, setDraftSettings] = useState<AppSettings>(settings);
  const [draftTimeline, setDraftTimeline] = useState<TimelineItem[]>(timeline);
  const [draftGallery, setDraftGallery] = useState<GalleryItem[]>(gallery);
  const [draftFunny, setDraftFunny] = useState<FunnyCard[]>(funny);
  const [draftLetter, setDraftLetter] = useState<string[]>(letter);
  const [draftFuture, setDraftFuture] = useState<BucketListItem[]>(future);

  // Determine if draft differs from saved props
  const isDirty = useMemo(() => {
    return (
      JSON.stringify(draftSettings) !== JSON.stringify(settings) ||
      JSON.stringify(draftTimeline) !== JSON.stringify(timeline) ||
      JSON.stringify(draftGallery) !== JSON.stringify(gallery) ||
      JSON.stringify(draftFunny) !== JSON.stringify(funny) ||
      JSON.stringify(draftLetter) !== JSON.stringify(letter) ||
      JSON.stringify(draftFuture) !== JSON.stringify(future)
    );
  }, [
    draftSettings, settings,
    draftTimeline, timeline,
    draftGallery, gallery,
    draftFunny, funny,
    draftLetter, letter,
    draftFuture, future
  ]);

  // Sync draft with incoming live props when not dirty
  useEffect(() => {
    if (!isDirty) {
      setDraftSettings(settings);
      setDraftTimeline(timeline);
      setDraftGallery(gallery);
      setDraftFunny(funny);
      setDraftLetter(letter);
      setDraftFuture(future);
    }
  }, [settings, timeline, gallery, funny, letter, future, isDirty]);

  // Unsaved changes browser reload/close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Save button action handler
  const handleSaveChanges = () => {
    onSaveStory({
      settings: draftSettings,
      timeline: draftTimeline,
      gallery: draftGallery,
      funny: draftFunny,
      letter: draftLetter,
      future: draftFuture
    });
  };

  // Exit editor mode handler
  const handleExitEditor = () => {
    if (isDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Leave anyway?');
      if (!confirmLeave) return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    window.location.href = url.toString();
  };

  // Factory reset with confirmation
  const handleResetWithConfirm = () => {
    if (window.confirm('Are you sure you want to reset all story data to factory defaults?')) {
      onResetAll();
    }
  };

  // Local Draft Handlers
  const updateSetting = (key: keyof AppSettings, value: any) => {
    setDraftSettings(prev => ({ ...prev, [key]: value }));
  };

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
    setDraftTimeline(prev => [...prev, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    setDraftTimeline(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimelineItem = (index: number, key: keyof TimelineItem, value: any) => {
    setDraftTimeline(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `g_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      type: 'image',
      caption: 'A stunning captured glance.'
    };
    setDraftGallery(prev => [...prev, newItem]);
  };

  const removeGalleryItem = (index: number) => {
    setDraftGallery(prev => prev.filter((_, i) => i !== index));
  };

  const updateGalleryItem = (index: number, key: keyof GalleryItem, value: any) => {
    setDraftGallery(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const addFunnyItem = () => {
    const newItem: FunnyCard = {
      id: `f_${Date.now()}`,
      text: 'Funny Inside Joke text',
      image: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=1200&auto=format&fit=crop',
      caption: 'The story behind the laughs.'
    };
    setDraftFunny(prev => [...prev, newItem]);
  };

  const removeFunnyItem = (index: number) => {
    setDraftFunny(prev => prev.filter((_, i) => i !== index));
  };

  const updateFunnyItem = (index: number, key: keyof FunnyCard, value: any) => {
    setDraftFunny(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const updateLetterLine = (index: number, value: string) => {
    setDraftLetter(prev => prev.map((line, i) => i === index ? value : line));
  };

  const addLetterLine = () => {
    setDraftLetter(prev => [...prev, '']);
  };

  const removeLetterLine = (index: number) => {
    setDraftLetter(prev => prev.filter((_, i) => i !== index));
  };

  const addFutureItem = () => {
    const newItem: BucketListItem = {
      id: `b_${Date.now()}`,
      text: 'Our next dream milestone',
      category: 'travel',
      completed: false
    };
    setDraftFuture(prev => [...prev, newItem]);
  };

  const removeFutureItem = (index: number) => {
    setDraftFuture(prev => prev.filter((_, i) => i !== index));
  };

  const updateFutureItem = (index: number, key: keyof BucketListItem, value: any) => {
    setDraftFuture(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
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
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-2 bg-zinc-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(255,92,138,0.6)] animate-pulse" />
            <h1 className="text-sm font-semibold tracking-tight font-display text-white">
              730 Studio Editor
            </h1>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Cloud-synced story studio
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetWithConfirm}
            className="p-1.5 rounded-lg hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Reset to Defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExitEditor}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="Exit Editor Mode"
          >
            <X className="w-3.5 h-3.5 text-zinc-400" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Editor Navigation */}
      <div className="flex border-b border-zinc-900 bg-zinc-950 px-2 pt-1 gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', icon: <Settings className="w-3.5 h-3.5" />, label: 'General' },
          { id: 'timeline', icon: <Clock className="w-3.5 h-3.5" />, label: 'Timeline' },
          { id: 'gallery', icon: <Image className="w-3.5 h-3.5" />, label: 'Gallery' },
          { id: 'funny', icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Laughs' },
          { id: 'letter', icon: <FileText className="w-3.5 h-3.5" />, label: 'Letter' },
          { id: 'future', icon: <Compass className="w-3.5 h-3.5" />, label: 'Future' },
          { id: 'export', icon: <Download className="w-3.5 h-3.5" />, label: 'Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-2.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                  value={draftSettings.names}
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
                  value={draftSettings.relationshipStartDate}
                  onChange={(e) => updateSetting('relationshipStartDate', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Story Reveal Date & Time (Mobile Lock)
                </label>
                <input
                  type="datetime-local"
                  value={draftSettings.revealDateTime || '2026-08-15T00:00'}
                  onChange={(e) => updateSetting('revealDateTime', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-pink transition-colors"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Mobile viewers will see a live countdown lock screen until this date & time passes.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Soundtrack (Direct MP3 Link)
                </label>
                <input
                  type="text"
                  value={draftSettings.bgMusic}
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
                    value={draftSettings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border border-zinc-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={draftSettings.accentColor}
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
                Timeline Memories ({draftTimeline.length})
              </h3>
              <button
                onClick={addTimelineItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Memory
              </button>
            </div>

            <div className="space-y-4">
              {draftTimeline.map((item, idx) => (
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

                  <ImageDropZone
                    value={item.image}
                    onChange={(val) => updateTimelineItem(idx, 'image', val)}
                    label="Memory Photo"
                  />

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
                Gallery Slides ({draftGallery.length})
              </h3>
              <button
                onClick={addGalleryItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {draftGallery.map((item, idx) => (
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

                  <ImageDropZone
                    value={item.url}
                    onChange={(val) => updateGalleryItem(idx, 'url', val)}
                    label={item.type === 'video' ? 'Gallery Video' : 'Gallery Photo'}
                  />

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
                Giggles & Inside Jokes ({draftFunny.length})
              </h3>
              <button
                onClick={addFunnyItem}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Laugh
              </button>
            </div>

            <div className="space-y-4">
              {draftFunny.map((item, idx) => (
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

                  <ImageDropZone
                    value={item.image}
                    onChange={(val) => updateFunnyItem(idx, 'image', val)}
                    label="Joke / Memory Photo"
                  />

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
                Love Letter Paragraphs ({draftLetter.length})
              </h3>
              <button
                onClick={addLetterLine}
                className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-brand-pink text-white px-2.5 py-1 rounded-md hover:bg-brand-pink/90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Paragraph
              </button>
            </div>

            <div className="space-y-4">
              {draftLetter.map((line, idx) => (
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
                    Paragraph {idx + 1} {idx === 0 ? '(Greeting / Hook)' : idx === draftLetter.length - 1 ? '(Signature)' : ''}
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

        {/* ==================== FUTURE TAB ==================== */}
        {activeTab === 'future' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Future Milestones ({draftFuture.length})
              </h3>
              <button
                onClick={addFutureItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-pink text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Goal
              </button>
            </div>

            <div className="space-y-4">
              {draftFuture.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3 relative group">
                  <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => removeFutureItem(idx)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[9px] font-mono text-brand-pink uppercase tracking-widest block">
                    Goal {idx + 1}
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Goal Description</label>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateFutureItem(idx, 'text', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono uppercase text-zinc-500 mb-0.5">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateFutureItem(idx, 'category', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="travel">Travel</option>
                        <option value="nesting">Nesting</option>
                        <option value="life">Life</option>
                        <option value="silly">Silly</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== EXPORT TAB ==================== */}
        {activeTab === 'export' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Export / Backup JSON
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Edits are saved live to Firebase Firestore in real time. Download JSON backups below anytime!
            </p>

            <div className="flex flex-col gap-3.5 pt-2">
              <button
                onClick={() => downloadJSON('settings.json', draftSettings)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">settings.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Couples names, start date, mp3 music URL.</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('timeline.json', draftTimeline)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">timeline.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Sweet memories chapters list ({draftTimeline.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('gallery.json', draftGallery)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">gallery.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Captioned video/photo slide assets ({draftGallery.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('funny.json', draftFunny)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">funny.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Inside giggles, punchlines, image arrays ({draftFunny.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('letter.json', draftLetter)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">letter.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Full paragraph signature letter array.</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>

              <button
                onClick={() => downloadJSON('future.json', draftFuture)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-brand-pink/40 text-xs transition-all cursor-pointer text-left group"
              >
                <div>
                  <div className="font-semibold text-white">future.json</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Future bucket list goals ({draftFuture.length} items).</div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-brand-pink transition-colors" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Fixed Bottom Save Action Bar */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2">
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved Changes
            </span>
          ) : saveStatus === 'saving' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          ) : saveStatus === 'saved' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
              <Check className="w-3 h-3" />
              All Changes Saved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
              Saved
            </span>
          )}
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={!isDirty || saveStatus === 'saving'}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md ${
            isDirty
              ? 'bg-brand-pink hover:bg-brand-pink/90 text-white shadow-brand-pink/20 scale-[1.02] active:scale-95 font-bold'
              : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed opacity-60'
          }`}
        >
          {saveStatus === 'saving' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
