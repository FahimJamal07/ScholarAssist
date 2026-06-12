import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  Trash2,
  Sparkles,
  Zap,
  Database,
} from 'lucide-react';

/**
 * ChatHeader — Compact header bar for the chat interface showing title,
 * model info, and action buttons.
 *
 * @param {number} messageCount - Number of messages in history
 * @param {Function} onClearHistory - Handler to clear chat
 * @param {boolean} isTyping - Whether AI is currently responding
 */
function ChatHeader({ messageCount = 0, onClearHistory, isTyping = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="shrink-0 px-6 md:px-8 pt-5 pb-4"
    >
      <div className="flex items-center justify-between">
        {/* Title + status */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <MessageSquareText className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-display tracking-tight">
              Chat with Research Papers
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-accent-cyan" />
                RAG-Powered
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Zap className="h-2.5 w-2.5 text-accent-amber" />
                Gemini + Claude
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Database className="h-2.5 w-2.5 text-accent-emerald" />
                Vector Retrieval
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Typing status */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-[10px] font-medium text-brand-400">Generating</span>
            </motion.div>
          )}

          {/* Message count */}
          {messageCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 text-[10px] text-slate-500 font-mono">
              {messageCount} msg{messageCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* Clear history */}
          {messageCount > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-800/60 to-transparent" />
    </motion.div>
  );
}

export default ChatHeader;
