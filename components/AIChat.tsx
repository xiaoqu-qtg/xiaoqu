import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { getGeminiChatResponse } from '../services/geminiService';
import { Send, Sparkles, User, Bot } from 'lucide-react';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: '嗨！我是宿舍小助手。为了家务吵架了？需要建议？还是单纯无聊？尽管问我！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => m.text);
    const response = await getGeminiChatResponse(history, userMsg);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        宿舍助手 <Sparkles className="ml-2 text-yellow-500" size={24} />
      </h2>

      <Card className="flex-1 overflow-y-auto mb-4 bg-gray-50 flex flex-col gap-3 p-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                 <span>{m.role === 'user' ? '你' : '小助手'}</span>
              </div>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-tl-none text-xs animate-pulse">
              思考中...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-indigo-500"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;