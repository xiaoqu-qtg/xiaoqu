import React, { useMemo } from 'react';
import { Roommate, Duty, Transaction } from '../types';
import { Card } from './ui/Card';
import { Calendar, Wallet, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';

interface DashboardProps {
  roommates: Roommate[];
  duties: Duty[];
  transactions: Transaction[];
  currentUser: Roommate;
  onChangeView: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ roommates, duties, transactions, currentUser, onChangeView }) => {
  
  const today = new Date().toISOString().split('T')[0];
  
  const todaysDuty = useMemo(() => {
    return duties.find(d => d.date === today);
  }, [duties, today]);

  const assignee = useMemo(() => {
    return roommates.find(r => r.id === todaysDuty?.roommateId);
  }, [todaysDuty, roommates]);

  const isMyTurn = assignee?.id === currentUser.id;

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'contribution' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }, [transactions]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">嗨, {currentUser.name} 👋</h1>
          <p className="text-sm text-gray-500">欢迎回到 DormMate 宿舍助手</p>
        </div>
        <div className={`h-10 w-10 rounded-full ${currentUser.avatar} flex items-center justify-center text-white font-bold shadow-md`}>
          {currentUser.name[0]}
        </div>
      </div>

      {/* Duty Alert Card */}
      <Card className={`${isMyTurn ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white'} transition-colors duration-300`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${isMyTurn ? 'text-indigo-200' : 'text-gray-400'}`}>
              今日值日
            </h2>
            <div className="mt-2 flex items-center gap-2">
              {todaysDuty ? (
                <>
                  <span className="text-3xl font-bold">{assignee?.name}</span>
                  <span className={`text-lg ${isMyTurn ? 'text-indigo-100' : 'text-gray-500'}`}>
                    负责 {todaysDuty.task}
                  </span>
                </>
              ) : (
                <span className="text-xl font-medium">今日无安排，嗨起来！</span>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-full ${isMyTurn ? 'bg-indigo-500' : 'bg-gray-100'}`}>
            {isMyTurn ? <AlertCircle className="w-6 h-6 text-white animate-pulse" /> : <Calendar className="w-6 h-6 text-gray-600" />}
          </div>
        </div>
        {isMyTurn && (
          <div className="mt-4 bg-white/20 p-2 rounded-lg text-sm text-indigo-50 backdrop-blur-sm">
            🚨 兄弟，今天到你了！干完活记得打卡。
          </div>
        )}
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card onClick={() => onChangeView('money')}>
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-500 text-xs">宿舍公费</p>
              <p className="text-xl font-bold text-gray-800">¥{totalBalance.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => onChangeView('games')}>
           <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Gamepad2 size={20} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-500 text-xs">娱乐时间</p>
              <p className="text-sm font-bold text-gray-800">随机抽签 & 游戏</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assistant Teaser */}
      <Card onClick={() => onChangeView('assistant')} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
             <Sparkles size={24} />
           </div>
           <div>
             <h3 className="font-bold text-lg">AI 宿舍小助手</h3>
             <p className="text-pink-100 text-sm">矛盾调解 & 游戏主持</p>
           </div>
         </div>
      </Card>
    </div>
  );
};

export default Dashboard;