"use client";
import "@/app/app/estoque/estoque.css";
import LancamentoAvulso from "@/components/ModalAlterarMaterial";
import MaterialTransfer from "@/components/ModalMaterialTransfer";
import { useState } from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaSearch,
} from "react-icons/fa";
export default function page() {
  const [inputSearch, setInputSearch] = useState("");
  const [showMaterialTransfer, setMaterialTransfer] = useState(false);
  const [showLancamentoAvulso, setLancamentoAvulso] = useState(false);

  const closeMaterialTransfer = () => {
    setMaterialTransfer(false);
  };
  const closeLancamentoAvulso = () => {
    setLancamentoAvulso(false);
  };
  return (
    <>
      {showMaterialTransfer && (
        <MaterialTransfer close={closeMaterialTransfer} />
      )}
      {showLancamentoAvulso && (
        <LancamentoAvulso close={closeLancamentoAvulso} />
      )}
      <div className="line-estoque">
        <div className="dash-item red">
          <span>1234.05 KG</span>
          <p>Estoque Total</p>
        </div>
        <div className="dash-item blue">
          <span>456.4 KG</span>
          <p>Entrada hoje</p>
        </div>

        <div className="dash-item green">
          <span>13.456,98</span>
          <p>Valor Total</p>
        </div>
        <div className="dash-item green">
          <span>R$ 5.432,23</span>
          <p>Projeçao de lucro</p>
        </div>
      </div>
      <div className="container-foot-btns">
        <button className=" btn" onClick={(e) => setLancamentoAvulso(true)}>
          {" "}
          Lançamento Avulso
        </button>
        <button className=" btn" onClick={(e) => setMaterialTransfer(true)}>
          {" "}
          Transferencia de Material
        </button>
        <div className="campo-search">
          <i>
            <FaSearch />
          </i>
          <input
            type="search"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Buscar um material especifico..."
          />
        </div>
      </div>
      <div className="containerMain">
        <table className="table">
          <thead>
            <th className="large">Material</th>
            <th className="sm-hidden">Grupo</th>
            <th>Estoque</th>
            <th>$ Médio</th>
            <th>Proj. Lucro</th>
          </thead>
          <tbody>
            <td className="material">Cobre 1</td>
            <td className="sm-hidden">oi</td>
            <td>456,45</td>
            <td>46,43</td>
            <td>5.566,34</td>
          </tbody>
          <tfoot>
            <tr>
              <td rowSpan={3}>
                <FaArrowAltCircleLeft />
                <p>página 1 de 10</p>
                <FaArrowAltCircleRight />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
