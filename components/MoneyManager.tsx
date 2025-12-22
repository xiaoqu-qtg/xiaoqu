import React, { useState, useMemo } from 'react';
import { Roommate, Transaction } from '../types';
import { Card } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Trash } from 'lucide-react';

interface MoneyManagerProps {
  roommates: Roommate[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const MoneyManager: React.FC<MoneyManagerProps> = ({ roommates, transactions, setTransactions }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'expense' | 'contribution'>('expense');
  const [payer, setPayer] = useState(roommates[0].id);

  const handleAdd = () => {
    if (!amount || !desc) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description: desc,
      type,
      payerId: payer,
      date: new Date().toISOString(),
    };
    setTransactions([newTx, ...transactions]);
    setAmount('');
    setDesc('');
  };

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => t.type === 'contribution' ? acc + t.amount : acc - t.amount, 0);
  }, [transactions]);

  // Data for Chart: Who spent the most (Expenses only)
  const spendingData = useMemo(() => {
    const map = new Map();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const current = map.get(t.payerId) || 0;
      map.set(t.payerId, current + t.amount);
    });
    return Array.from(map.entries()).map(([id, val]) => {
      const user = roommates.find(r => r.id === id);
      return { name: user?.name || '未知', value: val };
    });
  }, [transactions, roommates]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-gray-800">宿舍公费 💰</h2>
        <div className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          余额: ¥{balance.toFixed(2)}
        </div>
      </div>

      {/* Add Transaction */}
      <Card>
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`flex-1 py-1 rounded-md text-sm font-medium transition-all ${type === 'expense' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}
            onClick={() => setType('expense')}
          >
            支出 (花钱)
          </button>
          <button 
            className={`flex-1 py-1 rounded-md text-sm font-medium transition-all ${type === 'contribution' ? 'bg-white shadow text-green-500' : 'text-gray-500'}`}
            onClick={() => setType('contribution')}
          >
            充值 (交钱)
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200">
            <span className="text-gray-500 mr-2">¥</span>
            <input 
              type="number" 
              placeholder="0.00"
              className="flex-1 p-2 bg-transparent outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <input 
            type="text" 
            placeholder="描述 (例如：夜宵烧烤，卫生纸)"
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <select 
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            >
              {roommates.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <button 
              onClick={handleAdd}
              className={`px-4 py-2 rounded-lg text-white font-medium ${type === 'expense' ? 'bg-red-500' : 'bg-green-500'}`}
            >
              添加
            </button>
          </div>
        </div>
      </Card>

      {/* Chart */}
      {spendingData.length > 0 && (
        <Card className="h-64 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-500 w-full text-left mb-2">支出统计</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* History */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500">最近记录</h3>
        {transactions.map(t => {
           const person = roommates.find(r => r.id === t.payerId);
           return (
             <div key={t.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${t.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                   {t.type === 'expense' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800 text-sm">{t.description}</p>
                   <p className="text-xs text-gray-400">{person?.name} • {new Date(t.date).toLocaleDateString('zh-CN')}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <span className={`font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                   {t.type === 'expense' ? '-' : '+'}¥{t.amount.toFixed(2)}
                 </span>
                 <button 
                  onClick={() => setTransactions(transactions.filter(tr => tr.id !== t.id))}
                  className="text-gray-300 hover:text-red-400"
                 >
                   <Trash size={14} />
                 </button>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default MoneyManager;