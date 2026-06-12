import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  User,
  Bot,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Cpu,
  AlertTriangle,
} from 'lucide-react';
import { MESSAGE_ROLE } from '../../hooks/useChat.js';

/**
 * Model badge configuration for identifying which AI model responded.
 */
const modelBadges = {
  gemini: { label: 'Gemini', icon: Sparkles, color: 'text-accent-cyan', bg: 'bg-cyan-500/10' },
  claude: { label: 'Claude', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  system: { label: 'System', icon: Bot, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

/**
 * Custom markdown components for rendering inside chat bubbles.
 * Applies dark-theme styling consistent with the design system.
 */
const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
  h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2 font-display">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold text-white mt-3 mb-1.5 font-display">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold text-white mt-2 mb-1 font-display">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-slate-300">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-slate-300">{children}</ol>,
  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-brand-300 text-xs font-mono border border-slate-700/50">
          {children}
        </code>
      );
    }
    return (
      <pre className="my-2 p-3 rounded-lg bg-slate-900/80 border border-slate-700/40 overflow-x-auto">
        <code className="text-xs font-mono text-slate-300 leading-relaxed">{children}</code>
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-brand-500/40 pl-3 my-2 text-slate-400 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-xs border-collapse border border-slate-700/40 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-800/60">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-slate-300 border-b border-slate-700/40">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-slate-400 border-b border-slate-800/30">{children}</td>,
  hr: () => <hr className="my-3 border-slate-700/40" />,
};

/**
 * ChatBubble — Single message bubble with markdown rendering, citations,
 * model badge, copy action, and timestamp.
 *
 * @param {object} message - Message object from useChat
 * @param {boolean} isLatest - Whether this is the latest message (for animation)
 * @param {number} index - Message index for stagger animation
 */
function ChatBubble({ message, isLatest = false, index = 0 }) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === MESSAGE_ROLE.USER;
  const isError = message.isError;
  const modelBadge = !isUser ? modelBadges[message.model] || modelBadges.system : null;

  const formattedTime = useMemo(() => {
    if (!message.timestamp) return '';
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.timestamp]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isLatest ? 0.05 : 0 }}
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      id={`message-${message.id}`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-brand-500 to-brand-600'
              : isError
              ? 'bg-rose-500/15 border border-rose-500/30'
              : 'bg-slate-800 border border-slate-700/50'
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : isError ? (
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          ) : (
            <Bot className="h-4 w-4 text-brand-400" />
          )}
        </div>
      </div>

      {/* Bubble content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%] min-w-0`}>
        {/* Model badge + timestamp (assistant only) */}
        {!isUser && modelBadge && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${modelBadge.color}`}>
              <modelBadge.icon className="h-3 w-3" />
              {modelBadge.label}
            </span>
            {formattedTime && (
              <span className="text-[10px] text-slate-600">{formattedTime}</span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm ${
            isUser
              ? 'bg-brand-600/80 text-white rounded-tr-md'
              : isError
              ? 'glass-card border-rose-500/20 text-slate-200 rounded-tl-md'
              : 'glass-card text-slate-200 rounded-tl-md'
          }`}
        >
          {/* Markdown rendered content */}
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Citations */}
          {message.citations?.length > 0 && (
            <CitationList citations={message.citations} />
          )}

          {/* Action buttons (visible on hover) */}
          {!isUser && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* User timestamp */}
        {isUser && formattedTime && (
          <span className="text-[10px] text-slate-600 mt-1 px-1">{formattedTime}</span>
        )}
      </div>
    </motion.div>
  );
}

/**
 * CitationList — Renders source citations below an assistant message.
 */
function CitationList({ citations }) {
  const [expanded, setExpanded] = React.useState(false);
  const displayCitations = expanded ? citations : citations.slice(0, 3);
  const hasMore = citations.length > 3;

  return (
    <div className="mt-3 pt-3 border-t border-slate-700/30">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Sources ({citations.length})
        </p>
      </div>

      <div className="space-y-2">
        {displayCitations.map((cite, idx) => (
          <motion.div
            key={cite.citation_index ?? idx}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          >
            <span className="shrink-0 w-5 h-5 rounded-md bg-brand-500/15 text-brand-400 text-[10px] font-bold flex items-center justify-center font-mono">
              {cite.citation_index ?? idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {cite.text_snippet || cite.text || cite.content}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {cite.source && (
                  <span className="text-[10px] text-slate-500 truncate">{cite.source}</span>
                )}
                {cite.relevance_score != null && (
                  <span className="text-[10px] font-mono text-brand-400/70">
                    {(cite.relevance_score * 100).toFixed(0)}% match
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[10px] text-brand-400 hover:text-brand-300 transition-colors font-medium"
        >
          {expanded ? 'Show less' : `Show ${citations.length - 3} more sources`}
        </button>
      )}
    </div>
  );
}

export default ChatBubble;
