import type { Word } from './types';

const STORAGE_KEY = 'lexicon-luminary-wordbank';

export interface StoredWordBank {
  words: Word[];
  seenWords: string[];
}

export const storageService = {
  saveWordBank(words: Word[], seenWords: Set<string>): void {
    const data: StoredWordBank = {
      words,
      seenWords: Array.from(seenWords),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  loadWordBank(): StoredWordBank | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading word bank:', error);
      return null;
    }
  },

  exportWordBank(words: Word[], seenWords: Set<string>): string {
    const data: StoredWordBank = {
      words,
      seenWords: Array.from(seenWords),
    };
    return JSON.stringify(data, null, 2);
  },

  importWordBank(jsonString: string): StoredWordBank {
    try {
      const data = JSON.parse(jsonString);
      if (!data.words || !Array.isArray(data.words)) {
        throw new Error('Invalid word bank format');
      }
      return data;
    } catch (error) {
      throw new Error('Failed to import word bank. Invalid JSON format.');
    }
  },

  clearWordBank(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
