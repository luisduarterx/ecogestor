"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import "./../painel.css";
import { Navigation } from "@/components/Navigation";
import { HeaderPainel } from "@/components/HeaderPainel";
import { MainPainel } from "@/components/MainPainel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verify } from "crypto";
import { useAuth } from "@/hooks/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(true);
  const styleShowMenu = {
    marginLeft: showMenu ? "300px" : "0",
    width: showMenu ? "calc(100% - 300px)" : "100%",
  };
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // Garante que o layout não seja renderizado caso o usuário não esteja autenticado
  }
  return (
    //condicional para renderização
    <html lang="pt-BR">
      <head></head>
      <body>
        <div className="painel">
          <Navigation menuOpen={showMenu} setMenu={setShowMenu}></Navigation>

          <div className="containerPainel" style={styleShowMenu}>
            <HeaderPainel
              menuOpen={showMenu}
              setMenu={setShowMenu}
            ></HeaderPainel>
            <MainPainel>{children}</MainPainel>
          </div>
        </div>
      </body>
    </html>
  );
}
