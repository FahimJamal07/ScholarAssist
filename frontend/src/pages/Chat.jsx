import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatHeader from '../components/chat/ChatHeader.jsx';
import ChatBubble from '../components/chat/ChatBubble.jsx';
import ChatInput from '../components/chat/ChatInput.jsx';
import ChatEmptyState from '../components/chat/ChatEmptyState.jsx';
import TypingIndicator from '../components/chat/TypingIndicator.jsx';
import ScrollToBottom from '../components/chat/ScrollToBottom.jsx';
import { useChat } from '../hooks/useChat.js';

/**
 * Chat — Full-featured AI research chat page with message history,
 * markdown rendering, typing animations, citations, scroll management,
 * and backend integration.
 *
 * Architecture (per instructions.md):
 * - useChat hook: all chat state + API logic (Rule 1, 14)
 * - ChatBubble: markdown rendering + citations (Rule 2)
 * - ChatInput: auto-resize textarea + shortcuts (Rule 2)
 * - ChatHeader: compact header with model badges (Rule 2)
 * - TypingIndicator: animated loading state (Rule 12)
 * - ScrollToBottom: scroll management (Rule 12)
 * - No direct API calls from components (Rule 14, 24)
 * - No hardcoded values (Rule 3)
 *
 * The chat follows the RAG flow (Rule 18):
 * User Query → Vector Retrieval → Context Building → LLM Generation
 */
function Chat() {
  const {
    messages,
    isTyping,
    messageCount,
    sendMessage,
    cancelRequest,
    clearHistory,
    initializeChat,
  } = useChat();

  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  /**
   * Initialize chat with welcome message on mount.
   */
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  /**
   * Scroll to bottom when new messages arrive (if user is near bottom).
   */
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isAtBottom]);

  /**
   * Smooth scroll to the bottom of the messages container.
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Handle scroll events to show/hide the scroll-to-bottom button
   * and track whether user is near the bottom.
   */
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const threshold = 120;

    setShowScrollBtn(distanceFromBottom > threshold);
    setIsAtBottom(distanceFromBottom <= threshold);
  }, []);

  /**
   * Handle suggestion click from empty state.
   */
  const handleSuggestionClick = useCallback(
    (text) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <ChatHeader
        messageCount={messageCount}
        onClearHistory={clearHistory}
        isTyping={isTyping}
      />

      {/* Messages area */}
      {hasMessages ? (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
        >
          <div className="px-6 md:px-8 py-4 space-y-5 max-w-4xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isLatest={idx === messages.length - 1}
                index={idx}
              />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Scroll to bottom button */}
          <ScrollToBottom
            visible={showScrollBtn}
            onClick={scrollToBottom}
          />
        </div>
      ) : (
        /* Empty state with suggestions */
        <ChatEmptyState onSuggestionClick={handleSuggestionClick} />
      )}

      {/* Input bar */}
      <div className="px-6 md:px-8 pb-5 pt-2">
        <ChatInput
          onSend={sendMessage}
          onCancel={cancelRequest}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

export default Chat;
