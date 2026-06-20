import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your AI Health Assistant. How can I help you today? Please note that I provide educational information, not medical diagnoses.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/_/backend/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history: messages })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] relative animate-fade-in">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 text-sm text-center rounded-xl mb-4 shadow-sm border border-yellow-200 dark:border-yellow-800">
         <strong>Disclaimer:</strong> Not a substitute for professional medical advice. Call emergency services immediately if you are experiencing a medical emergency.
      </div>

      <div className="flex-1 overflow-y-auto glass-card p-4 md:p-6 mb-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1">
                <FaRobot />
              </div>
            )}
            <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600'}`}>
               <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center shrink-0 mt-1">
                <FaUser className="text-slate-500 dark:text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1">
                <FaRobot />
              </div>
             <div className="p-4 rounded-2xl bg-white dark:bg-slate-700 rounded-tl-none border border-slate-100 dark:border-slate-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="glass-card p-2 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Describe your symptoms or ask a health question..."
          className="flex-1 bg-transparent px-4 outline-none dark:text-white"
        />
        <button type="submit" disabled={loading} className="btn-primary rounded-xl p-3 flex items-center justify-center disabled:opacity-50">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
