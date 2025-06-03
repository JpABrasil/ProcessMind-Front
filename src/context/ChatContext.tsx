// src/context/ChatContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  chatAtual: any | null;
  setChatAtual: (chat: any | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatAtual, setChatAtual] = useState<any | null>(null);

  return (
    <ChatContext.Provider value={{ chatAtual, setChatAtual }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext deve ser usado dentro de um ChatProvider");
  }
  return context;
}
