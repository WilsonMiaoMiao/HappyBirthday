import React, { useState, useEffect } from 'react';
import { Category, QuoteRecord, CategoryConfig } from './types';
import { CATEGORY_CONFIG } from './constants';
import { HistoryModal } from './components/HistoryModal';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Main App State
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [history, setHistory] = useState<Record<Category, QuoteRecord[]>>({
    [Category.JOY]: [],
    [Category.ANGER]: [],
    [Category.SORROW]: [],
    [Category.FEAR]: [],
    [Category.BIRTHDAY]: [],
    [Category.ANSWERS]: []
  });

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('birthday_app_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('birthday_app_history', JSON.stringify(history));
  }, [history]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2025') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('密码错误，请重试');
      setPasswordInput('');
    }
  };

  const handleOpenCategory = (cat: Category) => {
    setActiveCategory(cat);
  };

  const handleCloseModal = () => {
    setActiveCategory(null);
  };

  const addHistoryItem = (cat: Category, text: string) => {
    const newRecord: QuoteRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      timestamp: Date.now(),
    };

    setHistory(prev => ({
      ...prev,
      [cat]: [...prev[cat], newRecord]
    }));
  };

  // Helper component for the 4 corner cards
  const EmotionCard = ({ category, className }: { category: Category, className?: string }) => {
    const config = CATEGORY_CONFIG[category];
    return (
      <div 
        onClick={() => handleOpenCategory(category)}
        className={`relative flex flex-col items-center justify-center p-6 md:p-10 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 group overflow-hidden ${config.colorClass} ${className}`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="text-6xl md:text-7xl mb-4 transform group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm">
          {config.icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-widest uppercase opacity-90">
          {config.label}
        </h2>
        <p className="mt-2 text-sm opacity-0 group-hover:opacity-75 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          {category === Category.JOY ? 'Tap for joy' : 
           category === Category.ANGER ? 'Find peace' : 
           category === Category.SORROW ? 'Find comfort' : 'Find courage'}
        </p>
      </div>
    );
  };

  // ------------------------------------------------------------------
  // RENDER: LOGIN SCREEN
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-stone-50 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-white/50">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 cake-float">🎂</div>
            <h1 className="text-2xl font-serif font-bold text-stone-800">Welcome</h1>
            <p className="text-stone-500 text-sm mt-2">请输入开启生日祝福的密钥</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white/50 text-center text-lg tracking-widest"
                autoFocus
              />
              {authError && (
                <p className="text-rose-500 text-xs text-center mt-2 animate-bounce">{authError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all active:scale-95"
            >
              进入
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: MAIN APP
  // ------------------------------------------------------------------
  return (
    <div className="h-screen w-screen flex flex-col bg-stone-50 overflow-hidden relative animate-[fadeIn_0.5s_ease-out]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Main Grid for 4 Emotions */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2 md:p-4 z-10 pb-20">
        <EmotionCard category={Category.JOY} className="rounded-tl-3xl rounded-br-lg" />
        <EmotionCard category={Category.ANGER} className="rounded-tr-3xl rounded-bl-lg" />
        <EmotionCard category={Category.SORROW} className="rounded-bl-3xl rounded-tr-lg" />
        <EmotionCard category={Category.FEAR} className="rounded-br-3xl rounded-tl-lg" />
      </div>

      {/* Central Birthday Cake Button (Absolute Position) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pb-20">
        <button
          onClick={() => handleOpenCategory(Category.BIRTHDAY)}
          className="group relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 cake-float"
        >
          <div className="absolute inset-0 rounded-full border-4 border-pink-100 opacity-50 group-hover:border-pink-300 transition-colors"></div>
          <div className="text-5xl md:text-6xl drop-shadow-md">
            🎂
          </div>
          <div className="absolute -bottom-10 w-40 text-center">
            <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-500 shadow-sm border border-stone-100">
              生日祝福
            </span>
          </div>
        </button>
      </div>

      {/* Bottom "Book of Answers" Bar */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
        <button
          onClick={() => handleOpenCategory(Category.ANSWERS)}
          className="w-full max-w-2xl bg-stone-800 text-stone-200 py-4 px-8 rounded-2xl shadow-xl flex items-center justify-between hover:bg-stone-700 transition-all duration-300 group border border-stone-700/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:animate-pulse">📖</span>
            <div className="text-left">
              <p className="font-bold text-lg">答案之书</p>
              <p className="text-xs text-stone-400">心中有惑？点击这里寻找指引</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center group-hover:bg-stone-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Modal Overlay */}
      {activeCategory && (
        <HistoryModal 
          isOpen={!!activeCategory}
          category={activeCategory}
          onClose={handleCloseModal}
          history={history[activeCategory]}
          onAddToHistory={addHistoryItem}
        />
      )}
    </div>
  );
};

export default App;