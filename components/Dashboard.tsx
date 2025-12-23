import React, { useMemo } from 'react';
import { Roommate, Duty, Transaction, StickyNote } from '../types';
import { Card } from './ui/Card';
import { Calendar, Wallet, Gamepad2, AlertCircle, MessageSquare, ChevronDown } from 'lucide-react';

interface DashboardProps {
  roommates: Roommate[];
  duties: Duty[];
  transactions: Transaction[];
  currentUser: Roommate;
  onChangeView: (view: any) => void;
  notes: StickyNote[];
  onSwitchUser: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ roommates, duties, transactions, currentUser, onChangeView, notes, onSwitchUser }) => {
  
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

  // 计算有多少条发给我的私密消息
  const privateMessagesCount = useMemo(() => {
    return notes.filter(n => n.recipientId === currentUser.id).length;
  }, [notes, currentUser.id]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">欢迎回来 👋</h1>
          <p className="text-sm text-gray-500 font-medium">今天也是愉快的一天</p>
        </div>
        <button 
          onClick={onSwitchUser}
          className={`h-11 w-11 rounded-full ${currentUser.avatar} flex items-center justify-center text-white font-bold shadow-md ring-4 ring-white transition-transform active:scale-90`}
        >
          {currentUser.name[0]}
        </button>
      </div>

      {/* Duty Alert Card */}
      <Card className={`${isMyTurn ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 shadow-lg' : 'bg-white'} transition-colors duration-300 relative overflow-hidden`}>
        {isMyTurn && <div className="absolute top-0 right-0 p-1 bg-red-500 text-[8px] font-bold text-white px-2 rounded-bl-lg uppercase">Important</div>}
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

      {/* Private Messages Notification */}
      {privateMessagesCount > 0 && (
        <Card onClick={() => onChangeView('notes')} className="bg-orange-50 border-orange-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-200 rounded-lg text-orange-600">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-orange-800 font-bold text-sm">收到私密悄悄话</p>
              <p className="text-orange-600 text-xs">你有 {privateMessagesCount} 条定向便利贴待查收</p>
            </div>
          </div>
          <ChevronDown size={20} className="text-orange-400 -rotate-90" />
        </Card>
      )}

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
              <p className="text-gray-500 text-xs font-medium">宿舍公费</p>
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
              <p className="text-gray-500 text-xs font-medium">娱乐时间</p>
              <p className="text-sm font-bold text-gray-800">随机抽签</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;