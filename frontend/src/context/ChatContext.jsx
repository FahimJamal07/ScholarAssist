import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [activePapers, setActivePapers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const addPaperToChat = (paperId) => {
    setActivePapers((prev) => [...new Set([...prev, paperId])]);
  };

  const removePaperFromChat = (paperId) => {
    setActivePapers((prev) => prev.filter((id) => id !== paperId));
  };

  return (
    <ChatContext.Provider value={{ activePapers, chatHistory, setChatHistory, addPaperToChat, removePaperFromChat }}>
      {children}
    </ChatContext.Provider>
  );
}
