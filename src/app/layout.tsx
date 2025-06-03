import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "../app/globals.css";
import LayoutClient from "@/components/layoutclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProcessMind Chats",
  description: "Chat ProcessMind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable}`}>
      <body className="overflow-hidden bg-green-950 flex flex-col ">
        <div
          className="h-20 w-10/10 flex flex-row items-center justify-between gap-10 pl-10 pr-10 mb-0"
          style={{ backgroundColor: "#2D4040" }}
        >
          <div className="flex flex-row items-center gap-10">
            <img
              src="/Governo do estado.svg"
              alt="Logo"
              className="h-12 w-auto"
            />
            <a className="text-white text-3xl font-medium font-montserrat">
              ProcessMind
            </a>
          </div>
        </div>
        <div
          className="flex flex-row h-2 w-10/10 "
          style={{ backgroundColor: "#4B9F37" }}
        ></div>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
