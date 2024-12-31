"use client";
import { useState } from "react";

export default function Page() {
  const [transation, setTransation] = useState(false);
  return (
    <div className="container">
      <h1 className="pageTitle">Compra e Venda</h1>
      <div className="containerMain">
        <div className="mainHeader">
          <h2>Nova Transaçao</h2>
          <input
            style={{ display: "none" }}
            type="checkbox"
            checked={transation}
            onChange={() => {
              setTransation(!transation);
            }}
          />

          <div
            className={` ${transation ? "compra" : "venda"} selectTransation`}
            onClick={() => {
              setTransation(!transation);
            }}
          >
            <div className="option">{transation ? "Compra" : "Venda"}</div>
          </div>
        </div>
      </div>
      <div className="containerMain">a</div>
    </div>
  );
}
