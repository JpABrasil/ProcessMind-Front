"use client";
import { useState, useEffect, Key } from "react";
import { useChatContext } from "@/context/ChatContext"
import ReactMarkdown from 'react-markdown';

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

function sendMessage(setChatAtual:any,prompt:string, arquivos: FileList | null) {
  setChatAtual((prevChat:any) => [...prevChat, { autor: "user", conteudo: prompt }]);

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
    if(data.novo_id){
      const searchParams = new URLSearchParams(window.location.search);
      // Adicionar ou modificar o parâmetro "id_chat"
      searchParams.set("id_chat", data.novo_id);
      // Atualizar a URL com os parâmetros antigos + o novo parâmetro
      const newUrl = `?${searchParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
    setChatAtual((prevChat:any) => [...prevChat, { autor: "model", conteudo: data.response }]);

  })
  .catch((error) => {
      console.error("Erro ao enviar mensagem:", error);
  })
}

export default function Home({ agente }: Readonly<{ agente: string }>) {
  const { chatAtual,setChatAtual } = useChatContext();
  const [prompt, setPrompt] = useState("");
  const [arquivos, setArquivos] = useState<FileList | null>(null);

  useEffect(() => {
    setChatAtual([]);  
  }, [agente, setChatAtual]);

  return (
    <main className="w-10/10 h-200 p-5 pt-0 flex flex-col">
      <div className="flex flex-col w-full h-8/10 p-4 pb-0 overflow-y-auto  items-center">
        <div className="flex flex-col w-200 overflow-y-auto overflow-x-hidden h-full gap-2"> 
          {(chatAtual ?? []).map((mensagem: { autor: string; conteudo: string | null | undefined; }, index: Key | null | undefined) => (
            <div key={index}
              className={`p-3 rounded-xl ${
                mensagem.autor === "user"
                  ? "max-w-md bg-gray-200 self-end text-black"
                  : "text-white text-2xl text-justify"
              }`}>
              <ReactMarkdown>{mensagem.conteudo}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-2/10 mb-5 p-4 pt-0 flex flex-col items-center" >
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-200 h-7/10 bg-green-800 text-white placeholder:white p-2 focus:outline-0 resize-none border-1 border-green-700 border-b-0 rounded-lg rounded-b-none" placeholder="Digite sua Mensagem"></textarea>
          <div className="w-200 h-3/10 bg-green-800 flex flex-row items-center border-green-700 border-1 border-t-0 rounded-lg rounded-t-none p-2">
            <input type="file" id="file-upload" className="hidden" onChange={(e) => setArquivos(e.target.files)}/>
            <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white rounded-4xl hover:bg-gray-300">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="" ><path d="M8.25 15.75V9.75H2.25C1.83579 9.75 1.5 9.41421 1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25H8.25V2.25C8.25 1.83579 8.58579 1.5 9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V8.25H15.75L15.8271 8.25391C16.2051 8.29253 16.5 8.61183 16.5 9C16.5 9.38817 16.2051 9.70747 15.8271 9.74609L15.75 9.75H9.75V15.75C9.75 16.1642 9.41421 16.5 9 16.5C8.58579 16.5 8.25 16.1642 8.25 15.75Z" fill="currentColor"></path></svg>
            </label>
            <button onClick={() => sendMessage(setChatAtual,prompt,arquivos)} className="w-fit h-fit bg-white text-green-950 hover:bg-gray-300 hover:cursor-pointer p-2 rounded-4xl ml-auto">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M7.99992 14.9993V5.41334L4.70696 8.70631C4.31643 9.09683 3.68342 9.09683 3.29289 8.70631C2.90237 8.31578 2.90237 7.68277 3.29289 7.29225L8.29289 2.29225L8.36906 2.22389C8.76184 1.90354 9.34084 1.92613 9.70696 2.29225L14.707 7.29225L14.7753 7.36842C15.0957 7.76119 15.0731 8.34019 14.707 8.70631C14.3408 9.07242 13.7618 9.09502 13.3691 8.77467L13.2929 8.70631L9.99992 5.41334V14.9993C9.99992 15.5516 9.55221 15.9993 8.99992 15.9993C8.44764 15.9993 7.99993 15.5516 7.99992 14.9993Z" fill="currentColor"></path></svg>
            </button>
          </div>
      </div>
    </main>
  );
}
