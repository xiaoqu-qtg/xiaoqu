import React, { useState } from 'react';
import { Roommate } from '../types';
import { Card } from './ui/Card';
import { Dices } from 'lucide-react';

interface GamesProps {
  roommates: Roommate[];
}

const Games: React.FC<GamesProps> = ({ roommates }) => {
  const [luckyPerson, setLuckyPerson] = useState<Roommate | null>(null);
  const [isRolling, setIsRolling] = useState(false);

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
    </div>
  );
};

export default Games;