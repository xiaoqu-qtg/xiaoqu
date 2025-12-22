import React, { useState, useEffect } from 'react';
import { MOCK_ROOMMATES } from './constants';
import { Roommate, Duty, Transaction, ViewState } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DutyRoster from './components/DutyRoster';
import MoneyManager from './components/MoneyManager';
import Games from './components/Games';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  
  // App State - In a real app, this would come from a backend or robust local storage hook
  const [currentUser, setCurrentUser] = useState<Roommate>(MOCK_ROOMMATES[0]);
  const [duties, setDuties] = useState<Duty[]>(() => {
    const saved = localStorage.getItem('dorm_duties');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dorm_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('dorm_duties', JSON.stringify(duties));
  }, [duties]);

  useEffect(() => {
    localStorage.setItem('dorm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Demo: Switch user to simulate different perspectives
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
      case 'games':
        return <Games roommates={MOCK_ROOMMATES} />;
      case 'assistant':
        return <AIChat />;
      default:
        return <Dashboard 
          roommates={MOCK_ROOMMATES} 
          duties={duties} 
          transactions={transactions} 
          currentUser={currentUser} 
          onChangeView={setView}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative overflow-hidden">
        
        {/* Top Safe Area / Status Bar simulation */}
        <div className="h-2 bg-indigo-600 w-full"></div>

        {/* Header content (User Switcher for Demo) */}
        <div className="px-6 py-2 flex justify-end">
           <button 
            onClick={switchUser} 
            className="text-xs text-indigo-500 underline decoration-indigo-200"
          >
             当前视角: {currentUser.name} (点击切换)
           </button>
        </div>

        {/* Main Content Area */}
        <main className="px-6 py-2 mb-20">
          {renderView()}
        </main>

        {/* Bottom Nav */}
        <Navigation currentView={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;