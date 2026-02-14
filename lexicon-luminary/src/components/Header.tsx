import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-slate-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-playfair font-bold text-slate-800">
                Lexicon Luminary
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Master English through history and cognitive science
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
