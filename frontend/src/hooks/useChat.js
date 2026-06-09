import { useState } from 'react';
import api from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text) => {
    setIsLoading(true);
    setError(null);
    const userMessage = { id: Date.now().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await api.post('/chat', { message: text });
      if (response.data.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: response.data.data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to send message');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error };
}
