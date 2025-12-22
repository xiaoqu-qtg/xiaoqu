import React, { useState } from 'react';
import { Roommate, GameType } from '../types';
import { generateGameContent } from '../services/geminiService';
import { Card } from './ui/Card';
import { Dices, RefreshCw, Bot, Loader2 } from 'lucide-react';

interface GamesProps {
  roommates: Roommate[];
}

const Games: React.FC<GamesProps> = ({ roommates }) => {
  const [luckyPerson, setLuckyPerson] = useState<Roommate | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // AI Game State
  const [gameContent, setGameContent] = useState<string>('');
  const [loadingGame, setLoadingGame] = useState(false);

  const handleRandomPick = () => {
    setIsRolling(true);
    setLuckyPerson(null);
    let counter = 0;
    const interval = setInterval(() => {
      setLuckyPerson(roommates[Math.floor(Math.random() * roommates.length)]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  const handleGenerateGame = async (type: GameType) => {
    setLoadingGame(true);
    setGameContent('');
    const content = await generateGameContent(type);
    setGameContent(content);
    setLoadingGame(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800">娱乐专区 🎮</h2>

      {/* Random Picker */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
        <div className="text-center py-6">
          <Dices className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">“天选之子”抽取</h3>
          <p className="text-indigo-100 text-sm mb-6">今天谁去拿外卖/倒垃圾？</p>
          
          <div className="h-16 flex items-center justify-center mb-6">
            {luckyPerson ? (
               <div className={`text-3xl font-bold animate-bounce`}>
                 🎉 {luckyPerson.name} 🎉
               </div>
            ) : (
              <span className="text-indigo-200 italic">点击按钮开始生死判决...</span>
            )}
          </div>

          <button 
            onClick={handleRandomPick}
            disabled={isRolling}
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-70"
          >
            {isRolling ? '洗牌中...' : '抽一个人！'}
          </button>
        </div>
      </Card>

      {/* AI Games */}
      <h3 className="font-bold text-gray-700 mt-8">AI 游戏主持</h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => handleGenerateGame(GameType.TRUTH_DARE)}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left hover:border-pink-300 transition-colors"
        >
          <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-pink-500 mb-2">
            <Bot size={18} />
          </div>
          <span className="font-semibold text-gray-800">真心话大冒险</span>
        </button>

        <button 
          onClick={() => handleGenerateGame(GameType.WHO_IS_SPY)}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left hover:border-blue-300 transition-colors"
        >
          <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-500 mb-2">
            <Bot size={18} />
          </div>
          <span className="font-semibold text-gray-800">谁是卧底</span>
        </button>
      </div>

      {/* Game Content Output */}
      {(loadingGame || gameContent) && (
        <Card className="bg-gray-800 text-white border-gray-700 mt-4">
          {loadingGame ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin mr-2" /> 正在脑暴中...
            </div>
          ) : (
             <div className="prose prose-invert">
               <p className="whitespace-pre-wrap">{gameContent}</p>
               <button 
                onClick={() => setGameContent('')}
                className="mt-4 text-xs text-gray-400 hover:text-white flex items-center"
               >
                 <RefreshCw size={12} className="mr-1" /> 清空
               </button>
             </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Games;