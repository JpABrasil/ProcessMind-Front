"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AgenteContextType = {
  agente: string;
  setAgente: (agente: string) => void;
  usuario: string; // opcional, se necessário
};

const AgenteContext = createContext<AgenteContextType | undefined>(undefined);

export function AgenteProvider({ children }: { children: ReactNode }) {
  const [agente, setAgente] = useState("QA Diário Oficial");
  const [usuario, setUsuario] = useState("defaultuser");

  return (
    <AgenteContext.Provider value={{ agente, setAgente, usuario: usuario}}>
      {children}
    </AgenteContext.Provider>
  );
}

export function useAgente() {
  const context = useContext(AgenteContext);
  if (context === undefined) {
    throw new Error("useAgente deve ser usado dentro de AgenteProvider");
  }
  return context;
}
