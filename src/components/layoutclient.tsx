"use client";
import { use, useEffect } from "react";
import React from "react"; 
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatProvider } from "@/context/ChatContext"; // novo
import { AgenteProvider, useAgente } from "@/context/AgentContext"

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AgenteProvider>
      <InnerLayoutClient>{children}</InnerLayoutClient>
    </AgenteProvider>
  );
}


function InnerLayoutClient({ children }: { children: React.ReactNode }) {
  const { agente, setAgente, usuario, setUsuario } = useAgente();
  
  const lista_agentes = ["Analista Gratificação Titulação"];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("agente", agente); // Atualiza ou adiciona 'agente'

    const newUrl = `?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, [agente]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const usuarioParam = searchParams.get("usuario");

    if (usuarioParam) {
      setUsuario(usuarioParam);
    } else {
      console.warn("Parâmetro 'usuario' não encontrado na URL. Usando valor padrão.");
    }
  }, []);

  return (
    <ChatProvider>
      <SidebarProvider>
        <AppSidebar key={agente}  />
        <main className="w-10/10 flex flex-col bg-[#f2f2f2]">
          <div className="flex flex-row p-2 items-center relative">
            {/*<SidebarTrigger className="color-white hover:bg-green-800 hover:cursor-pointer" />*/}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[#485465] bg-[#e4e4e4] font-medium hover:cursor-pointer hover:bg-[#bebebe] p-1 rounded-lg">
                Escolha seu Agente
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {lista_agentes.map((nome) => (
                  <DropdownMenuItem
                    key={nome}
                    onClick={() => {
                      const searchParams = new URLSearchParams(window.location.search);
                      searchParams.set("agente", nome); // Atualiza agente mantendo os outros parâmetros

                      const newUrl = `?${searchParams.toString()}`;
                      window.history.pushState({}, "", newUrl);

                      setAgente(nome);
                    }}
                  >
                    {nome}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a className="absolute left-1/2 -translate-x-1/2 text-2xl text-[#485465] font-medium">
              {agente}
            </a>
            <a className="ml-auto bg-[#e4e4e4] rounded-4xl text-green-900 pl-3 pr-3 mr-5 hover:cursor-pointer">
              {usuario[0]}
            </a>
          </div>
          <div key={agente}>{children}</div>
        </main>
      </SidebarProvider>
    </ChatProvider>
  );
}
