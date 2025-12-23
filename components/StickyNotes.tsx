import React, { useState } from 'react';
import { Roommate, StickyNote } from '../types';
import { NOTE_COLORS } from '../constants';
import { Card } from './ui/Card';
import { Plus, Trash2, ShieldAlert, Users, Lock } from 'lucide-react';

interface StickyNotesProps {
  roommates: Roommate[];
  notes: StickyNote[];
  setNotes: React.Dispatch<React.SetStateAction<StickyNote[]>>;
  currentUser: Roommate;
}

const StickyNotes: React.FC<StickyNotesProps> = ({ roommates, notes, setNotes, currentUser }) => {
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [recipientId, setRecipientId] = useState<string>(''); // 空字符串代表“所有人”
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNote = () => {
    if (!content.trim()) return;
    const newNote: StickyNote = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      recipientId: recipientId || undefined,
      content,
      isAnonymous: true, // 强制匿名
      color: selectedColor,
      date: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setContent('');
    setRecipientId('');
    setShowAddForm(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // 过滤可见性逻辑：
  // 1. 如果是全员可见 (recipientId 为空)，所有人可见
  // 2. 如果是定向消息，只有作者和收件人可见
  const visibleNotes = notes.filter(note => {
    if (!note.recipientId) return true;
    return note.authorId === currentUser.id || note.recipientId === currentUser.id;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">心声便利贴 📝</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-2 rounded-full shadow-lg transition-all ${showAddForm ? 'bg-gray-400 rotate-45' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        >
          <Plus size={24} />
        </button>
      </div>

      {showAddForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300 border-indigo-100 ring-4 ring-indigo-50">
          <div className="mb-4 flex flex-wrap gap-2 items-center">
             <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wider">发布给：</span>
             <button 
              onClick={() => setRecipientId('')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${!recipientId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
             >
               <Users size={12} /> 全体可见
             </button>
             {roommates.filter(r => r.id !== currentUser.id).map(r => (
               <button 
                key={r.id}
                onClick={() => setRecipientId(r.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${recipientId === r.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
               >
                 <Lock size={12} /> 私密发送给 {r.name}
               </button>
             ))}
          </div>

          <textarea 
            placeholder={recipientId ? `给 TA 的私密悄悄话...` : "写下你想对全宿舍说的话..."}
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {NOTE_COLORS.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${color} ${selectedColor === color ? 'border-gray-600 scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
              <ShieldAlert size={18} />
              匿名发布模式
            </div>
            <button 
              onClick={handleAddNote}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform"
            >
              发布
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {visibleNotes.length === 0 ? (
          <div className="col-span-2 text-center py-20 text-gray-400">
            <p>墙上空空的，写点什么吧～</p>
          </div>
        ) : (
          visibleNotes.map(note => {
            const isOwner = note.authorId === currentUser.id;
            const isPrivate = !!note.recipientId;

            return (
              <div 
                key={note.id}
                className={`${note.color} p-4 rounded-xl border-b-4 shadow-sm relative rotate-1 hover:rotate-0 transition-all hover:shadow-md group`}
              >
                {isPrivate && (
                  <div className="absolute -top-2 -right-1 bg-white p-1 rounded-full shadow-sm border border-gray-100 text-indigo-600">
                    <Lock size={12} />
                  </div>
                )}
                
                <div className="mb-6 text-sm text-gray-800 leading-relaxed font-medium min-h-[60px] break-words">
                  {note.content}
                </div>
                
                <div className="space-y-2">
                  {isPrivate && (
                    <div className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 bg-white/40 px-1.5 py-0.5 rounded w-fit">
                      {note.recipientId === currentUser.id ? 'To: 我' : '定向消息'}
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-inner bg-gray-400`}>
                        ?
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold">
                        神秘舍友
                      </span>
                    </div>
                    {isOwner && (
                      <button 
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StickyNotes;