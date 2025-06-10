"use client";
import { useState, useEffect, Key } from "react";
import { useChatContext } from "@/context/ChatContext"
import ReactMarkdown from 'react-markdown';

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

function sendMessage(setChatAtual:any,prompt:string, arquivos: FileList | null,setListaChats: any) {
  setChatAtual((prevChat:any) => [...prevChat, { autor: "user", conteudo: prompt }]);
  
  // Adiciona indicador de carregamento
  setChatAtual((prevChat:any) => [...prevChat, { autor: "loading", conteudo: null }]);

  const searchParams = new URLSearchParams(window.location.search);
  const id_chat = searchParams.get("id_chat") ?? "defaultchat";
  const agente = searchParams.get("agente") ?? "Analista Gratificação Titulação";
  const usuario = searchParams.get("usuario") ?? "defaultuser";

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("id_chat", id_chat);
  formData.append("usuario", usuario);
  formData.append("agente", agente);

  if (arquivos) {
    for (const element of arquivos) {
      formData.append("anexos", element); // pode usar "anexos[]" se o backend aceitar array
    }
  }

  //Envia a mensagem para o backend
  const url = `${backend}/enviar_mensagem`;
  fetch(url, {
    method: "POST",
    body:  formData,
  })
  .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
  }
    )
  .then((data) => { 
    // Remove o indicador de carregamento e adiciona a resposta
    setChatAtual((prevChat:any) => {
      const withoutLoading = prevChat.filter((msg:any) => msg.autor !== "loading");
      return [...withoutLoading, { autor: "model", conteudo: data.response }];
    });

    if(data.novo_id){
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("id_chat", data.novo_id);
      const newUrl = `?${searchParams.toString()}`;
      window.history.pushState({}, '', newUrl);

      setListaChats((prev: any) =>
        prev.map((chat: any) => {
            if (chat && chat.title === "Novo Chat") {
                return { ...chat, id: data.novo_id, title: data.novo_id };
            }
            return chat; // ← SEMPRE retorna o chat atual se não for alterado
        })
     );
    }
  })
  .catch((error) => {
      console.error("Erro ao enviar mensagem:", error);
      // Remove o indicador de carregamento em caso de erro
      setChatAtual((prevChat:any) => prevChat.filter((msg:any) => msg.autor !== "loading"));
  })
}

export default function Home({ agente }: Readonly<{ agente: string }>) {
  const { chatAtual, setChatAtual, listaChats, setListaChats } = useChatContext();
  const [prompt, setPrompt] = useState("");
  const [arquivos, setArquivos] = useState<FileList | null>(null);

  // Verifica se há arquivos anexados para ajustar o layout
  const hasAttachments = arquivos && arquivos.length > 0;

  useEffect(() => {
    setChatAtual([]);  
  }, [agente, setChatAtual]);

  return (
    <main className="w-10/10 h-200 p-5 pt-0 flex flex-col">
      {/* Área do chat - se ajusta conforme há anexos ou não */}
      <div className={`flex flex-col w-full p-4 pb-0 overflow-y-auto items-center ${
        hasAttachments ? 'h-7/10' : 'h-8/10'
      }`}>
        <div className="flex flex-col w-200 overflow-y-auto overflow-x-hidden h-full gap-2"> 
          {(chatAtual ?? []).map((mensagem: { autor: string; conteudo: string | null | undefined; }, index: Key | null | undefined) => (
            <div key={index}
              className={`p-3 rounded-xl ${
                mensagem.autor === "user"
                  ? "max-w-md bg-gray-200 self-end text-black"
                  : mensagem.autor === "loading"
                  ? "text-[#485465] flex items-center"
                  : "text-[#485465] text-2xl text-justify"
              }`}>
              {mensagem.autor === "loading" ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#485465] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-[#485465] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-[#485465] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">Digitando...</span>
                </div>
              ) : (
                <ReactMarkdown>{mensagem.conteudo}</ReactMarkdown>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área de entrada - se ajusta conforme há anexos ou não */}
      <div className={`w-full mb-5 p-4 pt-0 flex flex-col items-center ${
        hasAttachments ? 'h-3/10' : 'h-2/10'
      }`}>
        {/* Área para mostrar arquivos uploadados - acima da digitação */}
        {hasAttachments && (
          <div className="w-200 bg-[#f0f0f0] border border-gray-300 rounded-lg rounded-b-none p-2 mb-0">
            <div className="text-sm text-gray-600 mb-1">Arquivos anexados:</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(arquivos).map((arquivo, index) => (
                <div key={index} className="flex items-center bg-white rounded-lg px-3 py-1 text-sm border">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2">
                    <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700 truncate max-w-32">{arquivo.name}</span>
                  <button 
                    onClick={() => {
                      const newFiles = Array.from(arquivos).filter((_, i) => i !== index);
                      const dt = new DataTransfer();
                      newFiles.forEach(file => dt.items.add(file));
                      setArquivos(dt.files);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          className={`w-200 h-7/10 bg-[#e4e4e4] text-[#485465] placeholder:white p-2 focus:outline-0 resize-none ${
            hasAttachments ? 'rounded-none' : 'rounded-lg rounded-b-none'
          }`}
          placeholder="Digite sua Mensagem"
        />
        
        <div className="w-200 h-3/10 bg-[#e4e4e4] flex flex-row items-center border-t-0 rounded-lg rounded-t-none p-2">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={(e) => setArquivos(e.target.files)}
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white rounded-4xl hover:bg-gray-300">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="">
              <path d="M8.25 15.75V9.75H2.25C1.83579 9.75 1.5 9.41421 1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25H8.25V2.25C8.25 1.83579 8.58579 1.5 9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V8.25H15.75L15.8271 8.25391C16.2051 8.29253 16.5 8.61183 16.5 9C16.5 9.38817 16.2051 9.70747 15.8271 9.74609L15.75 9.75H9.75V15.75C9.75 16.1642 9.41421 16.5 9 16.5C8.58579 16.5 8.25 16.1642 8.25 15.75Z" fill="currentColor"/>
            </svg>
          </label>
          <button 
            onClick={() => {
              sendMessage(setChatAtual,prompt,arquivos,setListaChats);
              setPrompt(''); // Limpa o prompt após enviar
              setArquivos(null); // Limpa os arquivos após enviar
            }}
            className="w-fit h-fit bg-white text-green-950 hover:bg-gray-300 hover:cursor-pointer p-2 rounded-4xl ml-auto"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99992 14.9993V5.41334L4.70696 8.70631C4.31643 9.09683 3.68342 9.09683 3.29289 8.70631C2.90237 8.31578 2.90237 7.68277 3.29289 7.29225L8.29289 2.29225L8.36906 2.22389C8.76184 1.90354 9.34084 1.92613 9.70696 2.29225L14.707 7.29225L14.7753 7.36842C15.0957 7.76119 15.0731 8.34019 14.707 8.70631C14.3408 9.07242 13.7618 9.09502 13.3691 8.77467L13.2929 8.70631L9.99992 5.41334V14.9993C9.99992 15.5516 9.55221 15.9993 8.99992 15.9993C8.44764 15.9993 7.99993 15.5516 7.99992 14.9993Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}