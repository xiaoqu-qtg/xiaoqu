import React, { useState, useEffect } from 'react';
import { MOCK_ROOMMATES } from './constants';
import { Roommate, Duty, Transaction, ViewState, StickyNote } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DutyRoster from './components/DutyRoster';
import MoneyManager from './components/MoneyManager';
import Games from './components/Games';
import StickyNotes from './components/StickyNotes';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  
  // App State
  const [currentUser, setCurrentUser] = useState<Roommate>(MOCK_ROOMMATES[0]);
  const [duties, setDuties] = useState<Duty[]>(() => {
    const saved = localStorage.getItem('dorm_duties');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dorm_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem('dorm_notes');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        authorId: 'u3',
        content: '昨晚谁在走廊大声打电话？下次注意点哈 🤫',
        isAnonymous: true,
        color: 'bg-yellow-100 border-yellow-200',
        date: new Date().toISOString()
      },
      {
        id: '2',
        authorId: 'u2',
        content: '强哥今天买的西瓜超甜，给个好评！🍉',
        isAnonymous: true, // 修正为匿名
        color: 'bg-green-100 border-green-200',
        date: new Date().toISOString()
      },
      {
        id: '3',
        authorId: 'u4',
        recipientId: 'u1',
        content: '强哥，你昨晚借我的充电线落我桌子上了。',
        isAnonymous: true,
        color: 'bg-blue-100 border-blue-200',
        date: new Date().toISOString()
      }
    ];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('dorm_duties', JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem('dorm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dorm_notes', JSON.stringify(notes));
  }, [notes]);

  // Demo: Switch user to simulate different perspectives (Hidden in Dashboard now)
  const switchUser = () => {
    const currentIndex = MOCK_ROOMMATES.findIndex(r => r.id === currentUser.id);
    const nextIndex = (currentIndex + 1) % MOCK_ROOMMATES.length;
    setCurrentUser(MOCK_ROOMMATES[nextIndex]);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard 
          roommates={MOCK_ROOMMATES} 
          duties={duties} 
          transactions={transactions} 
          currentUser={currentUser} 
          onChangeView={setView}
          notes={notes}
          onSwitchUser={switchUser}
        />;
      case 'duty':
        return <DutyRoster 
          roommates={MOCK_ROOMMATES} 
          duties={duties} 
          setDuties={setDuties} 
        />;
      case 'money':
        return <MoneyManager 
          roommates={MOCK_ROOMMATES} 
          transactions={transactions} 
          setTransactions={setTransactions} 
        />;
      case 'notes':
        return <StickyNotes 
          roommates={MOCK_ROOMMATES}
          notes={notes}
          setNotes={setNotes}
          currentUser={currentUser}
        />;
      case 'games':
        return <Games roommates={MOCK_ROOMMATES} />;
      default:
        return <Dashboard 
          roommates={MOCK_ROOMMATES} 
          duties={duties} 
          transactions={transactions} 
          currentUser={currentUser} 
          onChangeView={setView}
          notes={notes}
          onSwitchUser={switchUser}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative overflow-hidden">
        
        {/* Top Safe Area / Status Bar simulation */}
        <div className="h-2 bg-indigo-600 w-full"></div>

        {/* Main Content Area */}
        <main className="px-6 py-6 mb-20">
          {renderView()}
        </main>

        {/* Bottom Nav */}
        <Navigation currentView={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;