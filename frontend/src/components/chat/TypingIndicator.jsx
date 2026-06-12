import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

/**
 * TypingIndicator — Animated "AI is typing" indicator shown while
 * waiting for a response. Uses a pulsing dot animation.
 */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700/50">
          <Bot className="h-4 w-4 text-brand-400" />
        </div>
      </div>

      {/* Typing bubble */}
      <div className="glass-card rounded-2xl rounded-tl-md px-5 py-4">
        <div className="flex items-center gap-1.5">
          {/* Animated dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
          <span className="ml-2 text-xs text-slate-500 font-medium">Analyzing papers...</span>
        </div>

        {/* Shimmer line */}
        <div className="mt-3 space-y-2">
          <div className="skeleton h-2.5 w-48 rounded-full" />
          <div className="skeleton h-2.5 w-36 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;
