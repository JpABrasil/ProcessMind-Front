"use client";
import { useState, useEffect,ReactElement } from "react";
import React from "react"; // Adicione uma importação, se necessário
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatProvider } from "@/context/ChatContext"; // novo


export default function LayoutClient({ children }: { children: ReactElement<{ agente: string }> }) {
  const [agente, setAgente] = useState("QA Diário Oficial");
  const [usuario, setUsuario] = useState("defaultuser");
  const lista_agentes = ["QA Diário Oficial", "Analista Gratificação Titulação"];
  const [chatAtual, setChatAtual] = useState(null);

  // useEffect para monitorar mudanças no agente
  useEffect(() => {
    const newUrl = `?agente=${encodeURIComponent(agente)}`;
    window.history.pushState({}, '', newUrl);
    setChatAtual(null); // Exemplo: limpar o chat atual quando o agente mudar
  }, [agente]); // O efeito será chamado sempre que o "agente" mudar

  // Componente Retornado
  return (
    <ChatProvider>
      <SidebarProvider>
        <AppSidebar key={agente} agente={agente} usuario={usuario} />
        <main className="w-10/10 flex flex-col">
          <div className="flex flex-row p-2 items-center relative">
            <SidebarTrigger className="color-white hover:bg-green-800 hover:cursor-pointer" />
            <DropdownMenu>
              <DropdownMenuTrigger className=" text-white hover:cursor-pointer hover:bg-green-800 p-1 rounded-lg ">
                Escolha seu Agente
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {lista_agentes.map((nome) => (
                  <DropdownMenuItem
                    key={nome}
                    onClick={() => {
                        const newUrl = `?agente=${encodeURIComponent(nome)}`;
                        window.history.pushState({}, '', newUrl);
                        setAgente(nome); // Mudar o agente
                    }}
                  >
                    {nome}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a className="absolute left-1/2 -translate-x-1/2 text-2xl text-white">{agente}</a>
            <a className="ml-auto bg-white rounded-full text-green-900 pl-2 pr-2 mr-5 hover:cursor-pointer">{usuario[0]}</a>
          </div>
         <div key={agente}> 
            {React.cloneElement(children, { agente })}
          </div>
        </main>
      </SidebarProvider>
    </ChatProvider>
  );
}
