"use client";
import { Grupos } from "@/app/auxiliar/gruposMateriais";
import { Array_materiais } from "@/app/auxiliar/materiais";
import MaterialCategory from "@/components/ModalMaterialCategory";
import PriceTables from "@/components/ModalPriceTables";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Page() {
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const [inputSearch, setInputSearch] = useState("");

  const closeModalCategory = () => {
    setShowModalCategory(false);
  };
  const closeModalPriceTable = () => {
    setShowPriceTable(false);
  };
  return (
    <div className="">
      <div className="container-foot-btns">
        {showModalCategory && <MaterialCategory close={closeModalCategory} />}
        {showPriceTable && <PriceTables close={closeModalPriceTable} />}

        <button className=" btn" onClick={() => setShowModalCategory(true)}>
          {" "}
          Grupos de Materiais
        </button>
        <button className="btn" onClick={() => setShowPriceTable(true)}>
          Tabelas de Preços
        </button>
      </div>
      <div className="containerMain">
        <div className="headerMateriais">
          <div className="campo">
            <label>Tabela:</label>
            <select>
              <option>Padrão</option>
              <option>Atacado</option>
            </select>
          </div>
          <div className="campo">
            <label>Grupo:</label>
            <select>
              <option value={"all"}>Todos</option>
              {Grupos.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
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

        <table className="tableOrder">
          <thead>
            <tr>
              <th>Material</th>
              <th className="sm-hidden">Grupo</th>
              <th>$ Compra</th>
              <th>$ Venda</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array_materiais.map((item) => (
              <tr>
                <td className="material">{item.name}</td>
                <td className="sm-hidden">{item.group}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.priceSell.toFixed(2)}</td>
                <td>{item.status ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
