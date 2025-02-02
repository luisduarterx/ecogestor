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

export default async function RootLayout({
  //transformei em async para aguardar verifytoken
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const verifyToken = async () => {
    console.log("acessei");
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch("http://localhost:4000/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!json.acess) {
          console.log(json);
          return false;
        }
        return true;
      } catch (error) {}
    } else {
      router.push("/login");
      return false;
    }
  };
  //verifica se existe um token
  const isAuth = verifyToken();
  if (!isAuth) {
    router.push("/login");
    return;
  }

  const [showMenu, setShowMenu] = useState(true);
  const styleShowMenu = {
    marginLeft: showMenu ? "300px" : "0",
    width: showMenu ? "calc(100% - 300px)" : "100%",
  };
  return (
    (await isAuth) && (
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
    )
  );
}
