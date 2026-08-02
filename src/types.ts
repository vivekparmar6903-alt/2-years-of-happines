export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  location: string;
  quote: string;
  tag?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption: string;
  aspectClass?: string; // 'aspect-[3/4]' | 'aspect-[4/3]' | 'aspect-square' etc. for masonry
}

export interface FunnyCard {
  id: string;
  text: string;
  image: string;
  caption: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface BucketListItem {
  id: string;
  text: string;
  category: 'travel' | 'life' | 'silly' | 'nesting';
  completed: boolean;
}

export interface AppSettings {
  siteTitle: string;
  names: string; // e.g. "Alex & Maya"
  relationshipStartDate: string; // e.g. "2024-07-11"
  revealDateTime?: string; // e.g. "2026-08-15T00:00:00"
  accentColor: string; // Hex color code
  bgMusic: string; // URL to background audio
  themeValues: {
    fontDisplay: string;
    romanticQuote: string;
  };
}
