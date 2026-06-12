import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

/**
 * ScrollToBottom — Floating button that appears when the user scrolls up
 * in the chat history. Clicking it smoothly scrolls to the latest message.
 *
 * @param {boolean} visible - Whether the button should be shown
 * @param {Function} onClick - Scroll-to-bottom handler
 * @param {number} unreadCount - Number of new messages below viewport
 */
function ScrollToBottom({ visible, onClick, unreadCount = 0 }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <button
            onClick={onClick}
            className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Scroll to bottom</span>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollToBottom;
