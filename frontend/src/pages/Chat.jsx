import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'assistant', text: 'Hello! Ask me any technical questions about the uploaded literature.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] max-w-6xl mx-auto w-full p-4">
      <div className="border-b border-slate-800 pb-3 mb-4">
        <h1 className="text-2xl font-bold text-white">Chat with Research Papers</h1>
        <p className="text-xs text-slate-400">Powered by Gemini & vector retrieval</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg bg-slate-900 border border-slate-800">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl rounded-lg px-4 py-2 ${m.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the papers..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
