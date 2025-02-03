"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaArchive,
  FaListOl,
  FaPeopleArrows,
  FaSearchLocation,
  FaSearchPlus,
} from "react-icons/fa";
import { FaCartPlus, FaHouse, FaList, FaX } from "react-icons/fa6";

type Props = {
  menuOpen: boolean;
  setMenu: (x: boolean) => void;
};
export const Navigation = ({ menuOpen, setMenu }: Props) => {
  const toggleMenu = () => setMenu(!menuOpen);
  const pathname = usePathname();
  return (
    <>
      {menuOpen && (
        <div className="navigationPainel">
          <div className="topMenu">
            <img src="/images/logosymbolbranco.png" alt="Logo" />
          </div>
          <ul className="menu">
            <Link legacyBehavior href={"/app/home"}>
              <li className={pathname === "/app/home" ? "active" : ""}>
                <FaHouse className="icon" /> Dashboard
              </li>
            </Link>
            <Link legacyBehavior href={"/app/compravenda"}>
              <li className={pathname === "/app/compravenda" ? "active" : ""}>
                <FaCartPlus /> Compra/Venda
              </li>
            </Link>
            <Link legacyBehavior href={"/app/estoque"}>
              <li className={pathname === "/app/estoque" ? "active" : ""}>
                <FaArchive /> Estoque
              </li>
            </Link>
            <Link legacyBehavior href={"/app/materiais"}>
              <li className={pathname === "/app/materiais" ? "active" : ""}>
                <FaList /> Materiais
              </li>
            </Link>
            <Link legacyBehavior href={"/app/funcionarios"}>
              <li className={pathname === "/app/funcionarios" ? "active" : ""}>
                <FaPeopleArrows /> Funcionários
              </li>
            </Link>
            <Link legacyBehavior href={"/app/relatorios"}>
              <li className={pathname === "/app/relatorios" ? "active" : ""}>
                <FaSearchPlus /> Relatórios
              </li>
            </Link>
          </ul>
          <span className="configOpt">ajustes</span>
        </div>
      )}
    </>
  );
};
