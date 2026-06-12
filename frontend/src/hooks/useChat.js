import { useState, useCallback, useRef, useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';
import api from '../services/api.js';

/**
 * Message role types used throughout the chat system.
 */
export const MESSAGE_ROLE = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

/**
 * Creates a unique message ID.
 * @returns {string} Unique ID string
 */
function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Welcome message shown when chat is first opened.
 */
const WELCOME_MESSAGE = {
  id: 'welcome',
  role: MESSAGE_ROLE.ASSISTANT,
  content: `Welcome to **ScholarAssist Chat** 👋

I'm your AI research assistant powered by **RAG-based retrieval** and **Gemini**. I can help you:

- 📄 **Answer questions** about your uploaded research papers
- 🔍 **Find relevant passages** with semantic search
- 📊 **Summarize findings** across multiple papers
- 🔗 **Identify connections** between different studies

Upload some papers first, then ask me anything!`,
  citations: [],
  model: 'system',
  timestamp: new Date().toISOString(),
};

/**
 * useChat — Comprehensive chat hook with message history management,
 * typing simulation, citation handling, error recovery, and backend
 * integration via the centralized API service.
 *
 * Features:
 * - Persistent chat history via ChatContext
 * - Typing indicator state
 * - Per-message citation/source tracking
 * - Model info per response (gemini/claude)
 * - Error messages inline in chat
 * - Clear history
 * - Abort in-flight requests
 *
 * @returns {object} Chat state and actions
 */
export function useChat() {
  const { chatHistory, setChatHistory, activePapers } = useContext(ChatContext);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  /**
   * Initializes chat with the welcome message if empty.
   */
  const initializeChat = useCallback(() => {
    if (chatHistory.length === 0) {
      setChatHistory([WELCOME_MESSAGE]);
    }
  }, [chatHistory.length, setChatHistory]);

  /**
   * Sends a user message and receives an AI response.
   *
   * @param {string} text - User's message text
   * @returns {Promise<boolean>} Whether the message was sent successfully
   */
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return false;

    setError(null);

    // Add user message immediately
    const userMessage = {
      id: createMessageId(),
      role: MESSAGE_ROLE.USER,
      content: trimmed,
      citations: [],
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Prepare abort controller
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await api.post(
        '/chat',
        {
          message: trimmed,
          paper_ids: activePapers,
        },
        { signal: controller.signal }
      );

      if (response.data.success) {
        const data = response.data.data;

        // Extract response content — handle various backend formats
        const responseContent =
          typeof data.response === 'string'
            ? data.response
            : data.response?.answer || data.response?.text || 'No response generated.';

        // Extract citations if available
        const citations = data.response?.citations || data.citations || [];

        // Extract model info
        const model = data.model || data.response?.model || 'gemini';

        const assistantMessage = {
          id: createMessageId(),
          role: MESSAGE_ROLE.ASSISTANT,
          content: responseContent,
          citations,
          model,
          timestamp: new Date().toISOString(),
        };

        setChatHistory((prev) => [...prev, assistantMessage]);
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to get response from AI.');
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        // Don't show error for cancelled requests
        return false;
      }

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred. Please try again.';

      setError(errorMessage);

      // Add error message to chat as system message
      const errorMsg = {
        id: createMessageId(),
        role: MESSAGE_ROLE.ASSISTANT,
        content: `⚠️ **Error:** ${errorMessage}\n\nPlease try again or check if the backend is running.`,
        citations: [],
        model: 'system',
        isError: true,
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, errorMsg]);
      return false;
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [isTyping, activePapers, setChatHistory]);

  /**
   * Cancels the current in-flight request.
   */
  const cancelRequest = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      setIsTyping(false);
    }
  }, []);

  /**
   * Clears all chat history and re-initializes with welcome message.
   */
  const clearHistory = useCallback(() => {
    setChatHistory([WELCOME_MESSAGE]);
    setError(null);
    setIsTyping(false);
  }, [setChatHistory]);

  /**
   * Removes a specific message by ID.
   *
   * @param {string} messageId - ID of message to remove
   */
  const removeMessage = useCallback((messageId) => {
    setChatHistory((prev) => prev.filter((m) => m.id !== messageId));
  }, [setChatHistory]);

  // Computed values
  const messageCount = chatHistory.filter(
    (m) => m.role === MESSAGE_ROLE.USER || (m.role === MESSAGE_ROLE.ASSISTANT && m.id !== 'welcome')
  ).length;

  return {
    messages: chatHistory,
    isTyping,
    error,
    messageCount,
    sendMessage,
    cancelRequest,
    clearHistory,
    removeMessage,
    initializeChat,
  };
}
