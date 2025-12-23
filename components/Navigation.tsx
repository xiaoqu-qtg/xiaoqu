import React from 'react';
import { Home, Calendar, Wallet, Gamepad2, StickyNote } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: '首页' },
    { id: 'duty', icon: Calendar, label: '值日' },
    { id: 'money', icon: Wallet, label: '账本' },
    { id: 'notes', icon: StickyNote, label: '贴纸' },
    { id: 'games', icon: Gamepad2, label: '娱乐' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${isActive ? 'text-indigo-600 -translate-y-2' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`${isActive ? 'bg-indigo-50 p-2 rounded-full shadow-sm' : ''}`}>
                 <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && <span className="text-[10px] font-bold mt-1">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;