import React, { useState, useEffect, useCallback } from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Check from 'lucide-react/dist/esm/icons/check';
import Heart from 'lucide-react/dist/esm/icons/heart';
import { cn } from './lib/utils';

export default function App() {
  // State initialization with lazy init for performance
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('ghibli-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('ghibli-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prev => [newTodo, ...prev]);
    setInput('');
  }, [input]);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/assets/asset.png')`,
        backgroundColor: '#F5E6D3' 
      }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-[#F5E6D3]/50 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="p-6 pb-4 bg-[#8B5E3C]/10 border-b border-[#8B5E3C]/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#8B5E3C] bg-white">
              <img src="/assets/asset_1.png" alt="Dog Mascot" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#8B5E3C] tracking-tight">멍멍 투두</h1>
              <p className="text-xs text-[#5C8D89] font-medium">지브리 감성 힐링 공간</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div className="text-sm text-[#8B5E3C]">
              완료된 할 일: <span className="font-bold">{completedCount}</span> / {todos.length}
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} size={14} className={cn("fill-[#5C8D89] text-[#5C8D89]", i >= completedCount && "opacity-30")} />
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <form onSubmit={addTodo} className="p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="오늘의 할 일을 적어보세요..."
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-transparent bg-[#F5E6D3]/50 focus:bg-white focus:border-[#5C8D89] outline-none transition-all text-[#8B5E3C] placeholder-[#8B5E3C]/50"
          />
          <button 
            type="submit"
            className="p-3 bg-[#5C8D89] hover:bg-[#4a726f] text-white rounded-2xl transition-transform active:scale-95 shadow-lg flex items-center justify-center"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* Todo List Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <img src="/assets/asset_1.png" alt="Empty" className="w-24 h-24 object-cover rounded-full grayscale mb-4" />
              <p className="text-[#8B5E3C] font-medium">아직 할 일이 없어요!</p>
              <p className="text-xs text-[#8B5E3C]/70">새로운 계획을 세워볼까요?</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id}
                className={cn(
                  "group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                  todo.completed ? "bg-[#5C8D89]/10" : "bg-white shadow-sm hover:shadow-md"
                )}
              >
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    todo.completed 
                      ? "bg-[#5C8D89] border-[#5C8D89] text-white" 
                      : "border-[#8B5E3C]/30 hover:border-[#5C8D89]"
                  )}
                >
                  {todo.completed && <Check size={14} strokeWidth={3} />}
                </button>
                
                <span className={cn(
                  "flex-1 text-[#8B5E3C] font-medium transition-all",
                  todo.completed && "line-through opacity-50"
                )}>
                  {todo.text}
                </span>

                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-[#8B5E3C]/40 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Decoration */}
        <div className="p-4 text-center">
          <p className="text-[10px] text-[#8B5E3C]/40 uppercase tracking-widest">
            Ghibli Dog Todo © 2024
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #5C8D8933;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5C8D8966;
        }
      `}</style>
    </div>
  );
}