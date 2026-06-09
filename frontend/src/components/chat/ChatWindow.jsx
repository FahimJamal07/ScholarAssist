import React from 'react';

function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg bg-slate-900 border border-slate-800">
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xl rounded-lg px-4 py-2 ${m.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
            <p className="text-sm">{m.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
