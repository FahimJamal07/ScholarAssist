import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Square,
  Paperclip,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';

/**
 * ChatInput — Premium chat input bar with auto-resizing textarea,
 * send/cancel buttons, keyboard shortcuts, and character count.
 *
 * @param {Function} onSend - Handler called with message text
 * @param {Function} onCancel - Handler for cancelling current request
 * @param {boolean} isTyping - Whether AI is currently responding
 * @param {boolean} disabled - Disable input
 */
function ChatInput({ onSend, onCancel, isTyping = false, disabled = false }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const MAX_CHARS = 4000;

  const canSend = input.trim().length > 0 && !isTyping && !disabled;

  /**
   * Auto-resize textarea to fit content.
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  /**
   * Focus textarea on mount.
   */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!canSend) return;
    onSend(input.trim());
    setInput('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="shrink-0"
    >
      <div className="relative glass-card !rounded-2xl p-2 transition-all duration-200 focus-within:border-brand-500/30 focus-within:shadow-glow-sm">
        <div className="flex items-end gap-2">
          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your papers..."
              disabled={disabled}
              rows={1}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none px-3 py-2.5 max-h-[200px] leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 pb-1 pr-1">
            {/* Cancel button (during typing) */}
            {isTyping ? (
              <button
                onClick={onCancel}
                className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors"
                title="Stop generating"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              /* Send button */
              <button
                onClick={handleSubmit}
                disabled={!canSend}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  canSend
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-sm hover:shadow-glow-md'
                    : 'bg-slate-800/60 text-slate-600 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom bar: hints + character count */}
        <div className="flex items-center justify-between px-3 pt-1 pb-0.5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-600 flex items-center gap-1">
              <CornerDownLeft className="h-2.5 w-2.5" />
              Enter to send
            </span>
            <span className="text-[10px] text-slate-700">Shift+Enter for new line</span>
          </div>

          {input.length > 0 && (
            <span className={`text-[10px] font-mono ${
              input.length > MAX_CHARS * 0.9 ? 'text-amber-400' : 'text-slate-600'
            }`}>
              {input.length}/{MAX_CHARS}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ChatInput;
