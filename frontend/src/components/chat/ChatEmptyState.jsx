import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  Sparkles,
  FileText,
  Search,
  BarChart3,
  BookOpen,
} from 'lucide-react';

/**
 * ChatEmptyState — Displayed when chat has no history (before welcome message).
 * Shows the AI capabilities and suggested starter prompts.
 *
 * @param {Function} onSuggestionClick - Handler when a suggestion is clicked
 */

const suggestions = [
  {
    text: 'Summarize the key findings across all uploaded papers',
    icon: FileText,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    text: 'What are the main methodologies used in the papers?',
    icon: Search,
    color: 'text-accent-cyan',
    bg: 'bg-cyan-500/10',
  },
  {
    text: 'Compare the approaches to attention mechanisms',
    icon: BarChart3,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    text: 'What are the limitations mentioned in the research?',
    icon: BookOpen,
    color: 'text-accent-amber',
    bg: 'bg-amber-500/10',
  },
];

function ChatEmptyState({ onSuggestionClick }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-brand-400" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 animate-glow-pulse" />
        </motion.div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white font-display mb-2">
          Research Intelligence Chat
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Ask questions about your uploaded papers. I use RAG-powered retrieval
          to ground my answers in your actual research.
        </p>

        {/* Suggestions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, idx) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="group glass-card-hover p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 p-1.5 rounded-lg ${suggestion.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${suggestion.color}`} />
                  </div>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    {suggestion.text}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default ChatEmptyState;
