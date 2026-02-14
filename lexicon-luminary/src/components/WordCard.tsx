import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, Volume2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Word } from '../types';
import { geminiService } from '../geminiService';

interface Props {
  word: Word;
  onAction: (wordId: string, action: 'like' | 'dislike' | 'favorite') => void;
}

export default function WordCard({ word, onAction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleSpeak = async () => {
    setPlaying(true);
    await geminiService.speakWord(word.word);
    setTimeout(() => setPlaying(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-playfair font-bold text-slate-800">
                {word.word}
              </h3>
              <button
                onClick={handleSpeak}
                disabled={playing}
                className="p-2 hover:bg-white rounded-full transition-colors disabled:opacity-50"
                title="Pronounce"
              >
                <Volume2 className={`w-5 h-5 text-indigo-600 ${playing ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            <p className="text-slate-600 text-lg font-mono">{word.ipa}</p>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {word.theme}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed">{word.definition}</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onAction(word.id, 'like')}
            className={`p-2 rounded-lg transition-colors ${
              word.liked
                ? 'bg-green-100 text-green-600'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Like"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAction(word.id, 'dislike')}
            className={`p-2 rounded-lg transition-colors ${
              word.disliked
                ? 'bg-red-100 text-red-600'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Dislike"
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAction(word.id, 'favorite')}
            className={`p-2 rounded-lg transition-colors ${
              word.favorited
                ? 'bg-yellow-100 text-yellow-600'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Favorite"
          >
            <Star className={`w-5 h-5 ${word.favorited ? 'fill-current' : ''}`} />
          </button>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
        >
          {expanded ? (
            <>
              Hide Details
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Deep Dive
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 space-y-6 bg-white">
          {/* Etymology */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-slate-800">Etymology</h4>
            </div>
            <p className="text-slate-600 leading-relaxed pl-7">{word.etymology}</p>
          </div>

          {/* History */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Historical Journey</h4>
            <p className="text-slate-600 leading-relaxed">{word.history}</p>
          </div>

          {/* Mnemonic */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Memory Aid</h4>
            <p className="text-purple-800 italic">{word.mnemonic}</p>
          </div>

          {/* Spelling Tip */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Spelling Tip</h4>
            <p className="text-green-800">{word.spellingTip}</p>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Usage Examples</h4>
            <ul className="space-y-2">
              {word.examples.map((example, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span className="text-slate-600 italic">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
