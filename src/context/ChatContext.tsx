// src/context/ChatContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  chatAtual: any | null;
  setChatAtual: (chat: any | null) => void;
  listaChats: any[];
  setListaChats: React.Dispatch<React.SetStateAction<{ id: string, titulo: string }[]>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatAtual, setChatAtual] = useState<any | null>(null);
  const [listaChats, setListaChats] = useState<{ id: string, titulo: string }[]>([]);

  return (
    <ChatContext.Provider value={{ chatAtual, setChatAtual, listaChats,setListaChats}}>
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
