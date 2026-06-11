import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquareText, Send, BookOpen, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import api from '../services/api.js';

function Chat() {
  const { chatHistory, setChatHistory } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I can answer questions about your uploaded research papers using RAG-powered retrieval. Ask me anything.',
          citations: [],
        },
      ]);
    }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: query, citations: [] };
    setChatHistory((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: query, paper_ids: [] });
      if (res.data.success) {
        const data = res.data.data;
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response?.answer || data.response || 'No response generated.',
          citations: data.response?.citations || [],
        };
        setChatHistory((prev) => [...prev, assistantMsg]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${res.data.error}`, citations: [] },
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'An error occurred. Please try again.', citations: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 md:px-8 pt-6 md:pt-8">
        <PageHeader
          icon={MessageSquareText}
          title="Chat with Research Papers"
          subtitle="RAG-powered Q&A grounded in your uploaded literature. Powered by Gemini & vector retrieval."
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 space-y-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand-600/80 text-white rounded-br-md'
                  : 'glass-card text-slate-200 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/40 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Sources</p>
                  {msg.citations.map((cite) => (
                    <div key={cite.citation_index} className="flex items-start gap-2 text-xs text-slate-400">
                      <BookOpen className="h-3 w-3 mt-0.5 shrink-0 text-brand-400" />
                      <span>
                        <span className="text-brand-300 font-medium">[{cite.citation_index}]</span>{' '}
                        {cite.text_snippet}
                        <span className="ml-1 text-slate-600">({(cite.relevance_score * 100).toFixed(0)}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-brand-400 animate-spin" />
              <span className="text-sm text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="shrink-0 px-6 md:px-8 pb-6 pt-2">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your papers..."
            disabled={loading}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
