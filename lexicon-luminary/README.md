# Lexicon Luminary 📚✨

A sophisticated, AI-powered linguistic platform designed to help users master the English language through historical context and cognitive science.

![Lexicon Luminary](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## 🌟 Features

### Two Distinct Modes

#### 📖 Vocabulary Explorer (Study Mode)
- **Curated Word Lists**: Generate lists of 10 sophisticated words based on themes:
  - Academic
  - Scientific
  - Literary
  - Corporate
  - Custom (specify your own!)
- **Deep Dive Analysis**: For every word, get:
  - IPA phonetic transcription
  - Etymological roots
  - Narrative history of the word's evolution
  - Creative memory mnemonics
  - Spelling tips
  - Real-world usage examples

#### 🎮 Etymology Quest (Game Mode)
- **Linguistic Detective Challenge**: Solve riddles about word origins
- **Level-Based Progression**: Difficulty increases as you advance
- **Ancient Tales**: AI-generated riddles that describe a word's historical journey without naming it
- **Score Tracking**: Earn points for correct answers
- **Word Collection**: Unlock and collect words by solving quests

### 🎯 Key Features

- **🔊 Audio Pronunciation**: Integrated Text-to-Speech for accurate pronunciation
- **🧠 Intelligent Word Bank**: Automatic tracking prevents word repetition
- **❤️ Personalization**: Like, dislike, or favorite words to track your preferences
- **💾 Data Portability**: Export and import your word bank via JSON files
- **🎨 Beautiful UI/UX**: 
  - Playfair Display typography for a literary aesthetic
  - Modern Tailwind CSS components
  - Smooth transitions and animations
  - Fully responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/athulkannan2000/Athul.git
   cd Athul/lexicon-luminary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Engine**: Google Gemini SDK
  - `gemini-1.5-flash` for text generation
  - Web Speech API for audio pronunciation
- **Icons**: Lucide React

## 📖 Usage

### Vocabulary Explorer

1. Select a theme (Academic, Scientific, Literary, Corporate, or Custom)
2. Click "Generate 10 Words" to create a new word list
3. Click on any word card to expand and see the "Deep Dive" details
4. Use the action buttons to:
   - 👍 Like words you want to remember
   - 👎 Dislike words you're not interested in
   - ⭐ Favorite words for quick access later
5. Filter your collection to show all words or just favorites

### Etymology Quest

1. Read the "Ancient Tale" riddle carefully
2. Type your answer (the word being described)
3. Submit your answer to check if it's correct
4. Earn points and level up with each correct answer
5. Unlocked words are automatically added to your collection

### Data Management

- **Export**: Click the "Export" button to download your word bank as a JSON file
- **Import**: Click "Import" and select a previously exported JSON file to restore your collection

## 🎨 Customization

The app uses Tailwind CSS for styling. You can customize the theme by editing:
- `tailwind.config.js` - Extend the theme with custom colors, fonts, etc.
- `src/index.css` - Add custom CSS styles

## 📦 Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `VITE_GEMINI_API_KEY` environment variable in the Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import the project in [Netlify](https://netlify.com)
3. Add the `VITE_GEMINI_API_KEY` environment variable in the Netlify dashboard
4. Set build command to `npm run build` and publish directory to `dist`
5. Deploy!

## 🔐 Security Note

**Important**: Never commit your `.env` file or expose your API key in public repositories. The `.env` file is already included in `.gitignore` to prevent accidental commits.

## 📝 License

© 2025 Athul A. All rights reserved.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Athul A**
- Email: athul2050.a@gmail.com
- LinkedIn: [linkedin.com/in/athul-a-ak](https://linkedin.com/in/athul-a-ak)
- Portfolio: [athulkannan2000.github.io/Athul](https://athulkannan2000.github.io/Athul)

## 🙏 Acknowledgments

- Google Gemini AI for powerful language generation
- React team for the amazing framework
- Tailwind CSS for beautiful styling utilities
- Lucide for the beautiful icon set

---

**Lexicon Luminary** - Transform vocabulary learning into a rich, narrative-driven exploration of human history and communication.
