"use client";
import { Array_materiais } from "@/app/auxiliar/materiais";
import MaterialCategory from "@/components/ModalMaterialCategory";
import PriceTables from "@/components/ModalPriceTables";
import { useState } from "react";

export default function Page() {
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);

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
        {Array_materiais.map((item) => item.name)}
      </div>
    </div>
  );
}
