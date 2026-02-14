import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { Word, EtymologyQuest } from '../types';
import { geminiService } from '../geminiService';

interface Props {
  words: Word[];
  seenWords: Set<string>;
  onWordUnlocked: (word: Word) => void;
}

export default function EtymologyQuestGame({ words, seenWords, onWordUnlocked }: Props) {
  const [currentQuest, setCurrentQuest] = useState<EtymologyQuest | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [unlockedWord, setUnlockedWord] = useState<Word | null>(null);

  const loadNewQuest = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setUserAnswer('');
    setUnlockedWord(null);
    
    try {
      const quest = await geminiService.generateEtymologyQuest(level, Array.from(seenWords));
      setCurrentQuest(quest);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load quest');
    } finally {
      setLoading(false);
    }
  }, [level, seenWords]);

  useEffect(() => {
    loadNewQuest();
  }, [loadNewQuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentQuest || !userAnswer.trim()) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuest.answer.toLowerCase().trim();
    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + level * 10);
      
      // Generate the word details for the unlocked word
      setLoading(true);
      try {
        const newWords = await geminiService.generateWords(
          'Academic',
          1,
          Array.from(seenWords)
        );
        
        if (newWords.length > 0) {
          const word: Word = {
            ...newWords[0],
            word: currentQuest.answer,
          };
          setUnlockedWord(word);
          onWordUnlocked(word);
        }
      } catch (error) {
        console.error('Error generating word details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNextQuest = () => {
    if (result === 'correct') {
      setLevel(level + 1);
    }
    loadNewQuest();
  };

  if (loading && !currentQuest) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-slate-800 mb-1">
              Etymology Quest
            </h2>
            <p className="text-slate-600">Uncover the hidden word from ancient tales</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-slate-800">{score}</span>
            </div>
            <p className="text-sm text-slate-600">Level {level}</p>
          </div>
        </div>
      </div>

      {/* Quest Card */}
      {currentQuest && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-slate-200">
            <h3 className="text-xl font-playfair font-bold text-slate-800 mb-4">
              Ancient Tale
            </h3>
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <p className="text-slate-700 leading-relaxed text-lg italic">
                {currentQuest.riddle}
              </p>
            </div>
          </div>

          {!result && (
            <form onSubmit={handleSubmit} className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What word is being described?
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {result && (
            <div className="p-6">
              <div className={`rounded-lg p-6 mb-6 ${
                result === 'correct'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {result === 'correct' ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-bold text-green-900">Correct!</h4>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600" />
                      <h4 className="text-lg font-bold text-red-900">Not quite right</h4>
                    </>
                  )}
                </div>
                <p className={result === 'correct' ? 'text-green-800' : 'text-red-800'}>
                  The answer was: <strong className="font-playfair text-xl">{currentQuest.answer}</strong>
                </p>
                {result === 'correct' && (
                  <p className="text-green-700 mt-2">
                    +{level * 10} points! The word has been added to your collection.
                  </p>
                )}
              </div>

              {unlockedWord && result === 'correct' && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-indigo-900 mb-3">Word Unlocked!</h4>
                  <div className="space-y-2 text-indigo-800">
                    <p><strong>Definition:</strong> {unlockedWord.definition}</p>
                    <p><strong>Etymology:</strong> {unlockedWord.etymology}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleNextQuest}
                disabled={loading}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Loading...' : 'Next Quest'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{words.length}</div>
            <div className="text-sm text-slate-600">Words Collected</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{level}</div>
            <div className="text-sm text-slate-600">Current Level</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{score}</div>
            <div className="text-sm text-slate-600">Total Score</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {words.filter(w => w.favorited).length}
            </div>
            <div className="text-sm text-slate-600">Favorites</div>
          </div>
        </div>
      </div>
    </div>
  );
}
