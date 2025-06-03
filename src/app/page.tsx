"use client";
import { useSearchParams } from "next/navigation";
import Home from "./home";

export default function Page() {
  const searchParams = useSearchParams();
  const agente = searchParams.get("agente") ?? "Analista Gratificação Titulação";

  return <Home agente={agente}  />;
}
