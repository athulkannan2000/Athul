import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { Word, WordTheme } from '../types';
import WordCard from './WordCard';

interface Props {
  words: Word[];
  loading: boolean;
  onGenerateWords: (theme: WordTheme, customTheme?: string) => void;
  onWordAction: (wordId: string, action: 'like' | 'dislike' | 'favorite') => void;
}

const themes: WordTheme[] = ['Academic', 'Scientific', 'Literary', 'Corporate', 'Custom'];

export default function VocabularyExplorer({ words, loading, onGenerateWords, onWordAction }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<WordTheme>('Academic');
  const [customTheme, setCustomTheme] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredWords = filter === 'favorites' 
    ? words.filter(w => w.favorited)
    : words;

  const handleGenerate = () => {
    if (selectedTheme === 'Custom' && !customTheme.trim()) {
      alert('Please enter a custom theme');
      return;
    }
    onGenerateWords(selectedTheme, customTheme);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-playfair font-bold text-slate-800 mb-4">
          Generate Vocabulary
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Theme
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as WordTheme)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          {selectedTheme === 'Custom' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Custom Theme
              </label>
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g., Medical, Legal, Architecture"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Generate 10 Words
            </>
          )}
        </button>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-bold text-slate-800">
          Your Word Collection ({filteredWords.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'favorites'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">
            {filter === 'favorites' 
              ? 'No favorite words yet. Mark words as favorites to see them here.'
              : 'No words yet. Generate your first word collection!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredWords.map(word => (
            <WordCard
              key={word.id}
              word={word}
              onAction={onWordAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
