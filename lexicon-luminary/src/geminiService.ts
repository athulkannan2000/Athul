import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Word, WordTheme, EtymologyQuest } from './types';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiService {
  private textModel;
  
  constructor() {
    // Use gemini-1.5-flash for text generation
    this.textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateWords(theme: WordTheme, count: number = 10, excludeWords: string[] = []): Promise<Word[]> {
    const excludeList = excludeWords.length > 0 
      ? `\n\nIMPORTANT: Do NOT include any of these words that have been seen before: ${excludeWords.join(', ')}`
      : '';

    const prompt = `Generate exactly ${count} sophisticated English words suitable for the "${theme}" theme.${excludeList}

For each word, provide:
1. The word itself
2. IPA phonetic transcription
3. Concise definition
4. Etymological roots (language of origin and original meaning)
5. A narrative history of the word's evolution (2-3 sentences)
6. A creative memory mnemonic
7. A spelling tip
8. 2-3 usage examples in different contexts

Format the response as a JSON array of objects with these exact keys:
word, ipa, definition, etymology, history, mnemonic, spellingTip, examples (array)

Respond ONLY with the JSON array, no additional text.`;

    try {
      const result = await this.textModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }
      jsonText = jsonText.trim();
      
      const wordsData = JSON.parse(jsonText);
      
      return wordsData.map((w: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        word: w.word,
        ipa: w.ipa,
        definition: w.definition,
        etymology: w.etymology,
        history: w.history,
        mnemonic: w.mnemonic,
        spellingTip: w.spellingTip,
        examples: Array.isArray(w.examples) ? w.examples : [w.examples],
        theme,
      }));
    } catch (error) {
      console.error('Error generating words:', error);
      throw new Error('Failed to generate words. Please check your API key.');
    }
  }

  async generateEtymologyQuest(level: number, excludeWords: string[] = []): Promise<EtymologyQuest> {
    const excludeList = excludeWords.length > 0 
      ? `\n\nIMPORTANT: Do NOT use any of these words: ${excludeWords.join(', ')}`
      : '';

    const difficulty = level <= 3 ? 'beginner' : level <= 7 ? 'intermediate' : 'advanced';
    
    const prompt = `Create a linguistic detective challenge for level ${level} (${difficulty} difficulty).${excludeList}

Generate an "Ancient Tale" - a creative riddle that describes the historical origin and evolution of an English word WITHOUT naming the word itself. The riddle should be poetic and mysterious, hinting at:
- The language(s) it came from
- Its original meaning
- How its meaning evolved over time
- Cultural or historical context

The word should be appropriate for ${difficulty} level vocabulary learners.

Format the response as JSON with these exact keys:
riddle (the ancient tale text), answer (the word being described)

Respond ONLY with the JSON object, no additional text.`;

    try {
      const result = await this.textModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }
      jsonText = jsonText.trim();
      
      const questData = JSON.parse(jsonText);
      
      return {
        id: `quest-${Date.now()}`,
        riddle: questData.riddle,
        answer: questData.answer.toLowerCase(),
        level,
        unlocked: false,
      };
    } catch (error) {
      console.error('Error generating quest:', error);
      throw new Error('Failed to generate etymology quest.');
    }
  }

  async speakWord(word: string): Promise<void> {
    // Use Web Speech API as fallback since Gemini TTS is not yet widely available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  }
}

export const geminiService = new GeminiService();
