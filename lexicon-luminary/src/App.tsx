import { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, Download, Upload, Sparkles } from 'lucide-react';
import type { Word, AppMode, WordTheme } from './types';
import { geminiService } from './geminiService';
import { storageService } from './storageService';
import VocabularyExplorer from './components/VocabularyExplorer';
import EtymologyQuestGame from './components/EtymologyQuestGame';
import Header from './components/Header';

function App() {
  const [mode, setMode] = useState<AppMode>('vocabulary');
  const [words, setWords] = useState<Word[]>([]);
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);

  // Load word bank on mount
  useEffect(() => {
    const saved = storageService.loadWordBank();
    if (saved) {
      setWords(saved.words);
      setSeenWords(new Set(saved.seenWords));
    }

    // Check if API key is set
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setApiKeySet(!!apiKey);
  }, []);

  // Save word bank whenever it changes
  useEffect(() => {
    if (words.length > 0) {
      storageService.saveWordBank(words, seenWords);
    }
  }, [words, seenWords]);

  const handleGenerateWords = async (theme: WordTheme, customTheme?: string) => {
    setLoading(true);
    try {
      const themeToUse = theme === 'Custom' && customTheme ? customTheme : theme;
      const newWords = await geminiService.generateWords(
        themeToUse as WordTheme,
        10,
        Array.from(seenWords)
      );
      
      setWords([...words, ...newWords]);
      setSeenWords(new Set([...seenWords, ...newWords.map(w => w.word.toLowerCase())]));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate words');
    } finally {
      setLoading(false);
    }
  };

  const handleWordAction = (wordId: string, action: 'like' | 'dislike' | 'favorite') => {
    setWords(words.map(w => {
      if (w.id === wordId) {
        return {
          ...w,
          liked: action === 'like' ? !w.liked : false,
          disliked: action === 'dislike' ? !w.disliked : false,
          favorited: action === 'favorite' ? !w.favorited : w.favorited,
        };
      }
      return w;
    }));
  };

  const handleExport = () => {
    const jsonString = storageService.exportWordBank(words, seenWords);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexicon-luminary-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const imported = storageService.importWordBank(jsonString);
        setWords(imported.words);
        setSeenWords(new Set(imported.seenWords));
        alert('Word bank imported successfully!');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to import word bank');
      }
    };
    reader.readAsText(file);
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-playfair font-bold text-slate-800">
              Lexicon Luminary
            </h1>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              API Key Required
            </h2>
            <p className="text-amber-800 mb-4">
              To use Lexicon Luminary, you need to set up a Google Gemini API key.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-amber-800 text-sm">
              <li>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a></li>
              <li>Create a <code className="bg-amber-100 px-2 py-1 rounded">.env</code> file in the project root</li>
              <li>Add: <code className="bg-amber-100 px-2 py-1 rounded">VITE_GEMINI_API_KEY=your_api_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <div className="text-sm text-slate-600">
            <p className="mb-2">
              <strong>Note:</strong> For production deployment, make sure to set the 
              <code className="bg-slate-100 px-2 py-1 rounded mx-1">VITE_GEMINI_API_KEY</code> 
              environment variable in your hosting platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg border border-slate-200">
            <button
              onClick={() => setMode('vocabulary')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === 'vocabulary'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Vocabulary Explorer
            </button>
            <button
              onClick={() => setMode('quest')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === 'quest'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              Etymology Quest
            </button>
          </div>
        </div>

        {/* Export/Import Controls */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleExport}
            disabled={words.length === 0}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-slate-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2 text-slate-700">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Content */}
        {mode === 'vocabulary' ? (
          <VocabularyExplorer
            words={words}
            loading={loading}
            onGenerateWords={handleGenerateWords}
            onWordAction={handleWordAction}
          />
        ) : (
          <EtymologyQuestGame
            words={words}
            seenWords={seenWords}
            onWordUnlocked={(word) => {
              setWords([...words, word]);
              setSeenWords(new Set([...seenWords, word.word.toLowerCase()]));
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
