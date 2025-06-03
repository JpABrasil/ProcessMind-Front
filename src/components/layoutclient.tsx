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
  
  const lista_agentes = ["QA Diário Oficial", "Analista Gratificação Titulação"];

  useEffect(() => {
    const newUrl = `?agente=${encodeURIComponent(agente)}`;
    window.history.pushState({}, "", newUrl);
  }, [agente]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenParam = searchParams.get("token");
      if (tokenParam) {
        localStorage.setItem("token", tokenParam);
        fetch(`https://processmind.up.railway.app/validar_token?{$token}`, {
          method: "GET",
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setUsuario(data.usuario);
            });
          } else {
            console.error("Token inválido ou expirado");
            window.location.href = "https://processmind.up.railway.app"; // ou outra ação apropriada
          }
        }).catch((error) => {
          console.error("Erro ao validar o token:", error);
          window.location.href = "https://processmind.up.railway.app"; // ou outra ação apropriada
        });
      }
      else {
        window.location.href = "https//processmind.up.railway.app"; // ou outra ação apropriada
      }
    }
    else {
      const token = localStorage.getItem("token");
    }
  }, []);

  return (
    <ChatProvider>
      <SidebarProvider>
        <AppSidebar key={agente} agente={agente} usuario={usuario} />
        <main className="w-10/10 flex flex-col">
          <div className="flex flex-row p-2 items-center relative">
            {/*<SidebarTrigger className="color-white hover:bg-green-800 hover:cursor-pointer" />*/}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white hover:cursor-pointer hover:bg-green-800 p-1 rounded-lg">
                Escolha seu Agente
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {lista_agentes.map((nome) => (
                  <DropdownMenuItem
                    key={nome}
                    onClick={() => {
                      const newUrl = `?agente=${encodeURIComponent(nome)}`;
                      window.history.pushState({}, "", newUrl);
                      setAgente(nome);
                    }}
                  >
                    {nome}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a className="absolute left-1/2 -translate-x-1/2 text-2xl text-white">
              {agente}
            </a>
            <a className="ml-auto bg-white rounded-full text-green-900 pl-2 pr-2 mr-5 hover:cursor-pointer">
              {usuario[0]}
            </a>
          </div>
          <div key={agente}>{children}</div>
        </main>
      </SidebarProvider>
    </ChatProvider>
  );
}
