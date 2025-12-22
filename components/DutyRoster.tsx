import React, { useState } from 'react';
import { Roommate, Duty } from '../types';
import { Card } from './ui/Card';
import { TASKS } from '../constants';
import { Check, Plus, Trash2 } from 'lucide-react';

interface DutyRosterProps {
  roommates: Roommate[];
  duties: Duty[];
  setDuties: React.Dispatch<React.SetStateAction<Duty[]>>;
}

const DutyRoster: React.FC<DutyRosterProps> = ({ roommates, duties, setDuties }) => {
  const [selectedTask, setSelectedTask] = useState(TASKS[0]);
  const [selectedRoommate, setSelectedRoommate] = useState(roommates[0].id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddDuty = () => {
    const newDuty: Duty = {
      id: Date.now().toString(),
      date: selectedDate,
      roommateId: selectedRoommate,
      task: selectedTask,
      isCompleted: false,
    };
    setDuties([...duties, newDuty].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const toggleComplete = (id: string) => {
    setDuties(duties.map(d => d.id === id ? { ...d, isCompleted: !d.isCompleted } : d));
  };

  const deleteDuty = (id: string) => {
    setDuties(duties.filter(d => d.id !== id));
  };

  // Group duties by date for display
  const sortedDuties = [...duties].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800">值日表 🧹</h2>

      {/* Add New Duty Form */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">安排值日</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select 
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              value={selectedRoommate}
              onChange={(e) => setSelectedRoommate(e.target.value)}
            >
              {roommates.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input 
              type="date" 
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              {TASKS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button 
              onClick={handleAddDuty}
              className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center w-12 hover:bg-indigo-700"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {sortedDuties.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>暂无值日安排，大家自由了！🎉</p>
          </div>
        ) : (
          sortedDuties.map(duty => {
            const assignee = roommates.find(r => r.id === duty.roommateId);
            const isPast = new Date(duty.date) < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <div 
                key={duty.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${duty.isCompleted ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${assignee?.avatar}`}>
                    {assignee?.name[0]}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${duty.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {assignee?.name} - {duty.task}
                    </p>
                    <p className={`text-xs ${isPast && !duty.isCompleted ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                      {new Date(duty.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
                      {isPast && !duty.isCompleted && " (逾期)"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleComplete(duty.id)}
                    className={`p-2 rounded-full ${duty.isCompleted ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => deleteDuty(duty.id)}
                    className="p-2 rounded-full text-red-400 bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DutyRoster;