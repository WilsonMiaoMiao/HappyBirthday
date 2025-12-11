import React, { useState, useEffect, useRef } from 'react';
import { Category, QuoteRecord } from '../types';
import { QUOTE_DATABASE, CATEGORY_CONFIG } from '../constants';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  history: QuoteRecord[];
  onAddToHistory: (category: Category, text: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  category,
  history,
  onAddToHistory
}) => {
  const [view, setView] = useState<'menu' | 'history' | 'drawing' | 'result'>('menu');
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const config = CATEGORY_CONFIG[category];
  const drawingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('menu');
    }
  }, [isOpen]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (drawingTimeoutRef.current) clearTimeout(drawingTimeoutRef.current);
    };
  }, []);

  const handleDrawNew = () => {
    setView('drawing');
    
    // Simple animation logic
    const pool = QUOTE_DATABASE[category];
    let count = 0;
    const maxCount = 20; // Number of shuffles
    const interval = 100; // Speed

    const shuffle = () => {
      const randomText = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuote(randomText);
      count++;

      if (count < maxCount) {
        drawingTimeoutRef.current = setTimeout(shuffle, interval);
      } else {
        // Final Selection
        const finalText = pool[Math.floor(Math.random() * pool.length)];
        setCurrentQuote(finalText);
        onAddToHistory(category, finalText);
        setView('result');
      }
    };

    shuffle();
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-[fadeIn_0.3s_ease-out]"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className={`p-6 text-center relative ${category === Category.ANSWERS ? 'bg-stone-800 text-stone-100' : 'bg-white text-stone-800 border-b border-stone-100'}`}>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-4xl mb-2">{config.icon}</div>
          <h2 className="text-xl font-bold font-serif">{config.title}</h2>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px] flex flex-col items-center justify-center">
          
          {/* MENU VIEW */}
          {view === 'menu' && (
            <div className="flex flex-col w-full gap-4">
              <button
                onClick={handleDrawNew}
                className={`w-full py-6 rounded-xl text-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${config.buttonClass}`}
              >
                <span>✨</span> 抽取新的语录
              </button>
              
              <button
                onClick={() => setView('history')}
                className="w-full py-6 rounded-xl text-lg font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors flex items-center justify-center gap-3"
              >
                <span>📜</span> 查看过去抽取
              </button>
            </div>
          )}

          {/* HISTORY VIEW */}
          {view === 'history' && (
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center mb-4">
                 <button onClick={() => setView('menu')} className="text-stone-400 hover:text-stone-600 text-sm flex items-center gap-1">
                    ← 返回
                 </button>
                 <span className="ml-auto text-stone-400 text-sm">共 {history.length} 条</span>
              </div>
              
              {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                  <p>还没有记录哦</p>
                  <button onClick={handleDrawNew} className="mt-2 text-blue-500 underline">去抽取一条</button>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  {[...history].reverse().map((record) => (
                    <div key={record.id} className="bg-stone-50 p-4 rounded-lg border border-stone-100 hover:bg-stone-100 transition-colors">
                      <p className="text-lg font-serif mb-2 text-stone-800">{record.text}</p>
                      <p className="text-xs text-stone-400 text-right">{formatDate(record.timestamp)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DRAWING ANIMATION VIEW */}
          {view === 'drawing' && (
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse">{config.icon}</div>
              <p className="text-2xl font-serif text-stone-400 animate-bounce">
                正在连接宇宙信号...
              </p>
              <div className="mt-8 opacity-50 blur-[1px]">
                {currentQuote || "..."}
              </div>
            </div>
          )}

          {/* RESULT VIEW */}
          {view === 'result' && (
            <div className="w-full flex flex-col items-center text-center h-full justify-center animate-[scaleIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs mb-4">
                  MESSAGE FOR YOU
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold leading-relaxed text-stone-800">
                  “{currentQuote}”
                </h3>
              </div>
              
              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => setView('menu')}
                  className="px-6 py-2 rounded-full border border-stone-300 text-stone-500 hover:bg-stone-50 transition-colors"
                >
                  返回
                </button>
                <button 
                  onClick={handleDrawNew}
                  className={`px-6 py-2 rounded-full text-white shadow-md hover:shadow-lg transition-all ${config.buttonClass}`}
                >
                  再抽一张
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};