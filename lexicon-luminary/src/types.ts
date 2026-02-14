export type WordTheme = 'Academic' | 'Scientific' | 'Literary' | 'Corporate' | 'Custom';

export interface Word {
  id: string;
  word: string;
  ipa: string;
  definition: string;
  etymology: string;
  history: string;
  mnemonic: string;
  spellingTip: string;
  examples: string[];
  theme: WordTheme;
  liked?: boolean;
  disliked?: boolean;
  favorited?: boolean;
  audioUrl?: string;
}

export interface WordBank {
  words: Word[];
  seenWords: Set<string>;
}

export interface EtymologyQuest {
  id: string;
  riddle: string;
  answer: string;
  level: number;
  unlocked: boolean;
  word?: Word;
}

export type AppMode = 'vocabulary' | 'quest';
