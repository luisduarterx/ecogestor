"use client";
import { order } from "@/types/types";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaEdit, FaPlus } from "react-icons/fa";

export default function Page() {
  const [showMateriais, setShowMateriais] = useState(true);
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPrice, setInputPrice] = useState("");

  const [currentOrder, setCurrentOrder] = useState<order>({
    id: 4554,
    cadastro: {
      id: 45,
      name: "Luis Claudio",
    },
    items: [
      {
        id: 1,
        material: "Estamparia de Aluminio",
        orderID: 4554,
        amount: 34,
        price: 4,
      },
      { id: 2, material: "Cobre 1", orderID: 4554, amount: 2, price: 40.0 },
      { id: 3, material: "Ferro", orderID: 4554, amount: 67, price: 1.0 },
      {
        id: 4,
        material: "Perfil Limpo",
        orderID: 4554,
        amount: 4,
        price: 10.5,
      },
    ],
    totalPrice: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let calculateTotalAmount = currentOrder.items?.reduce(
      (prev, item) => prev + item.amount,
      0
    ) as number;
    let calculateTotalValue = currentOrder.items?.reduce(
      (prev, item) => prev + item.amount * item.price,
      0
    ) as number;
    setTotalAmount(calculateTotalAmount);
    setTotalPrice(calculateTotalValue);
  }, [currentOrder.items]);
  return (
    <>
      <div className="containerMain">
        <div className="headerOrder">
          <h3 className="titleMain">
            <i>
              <FaArrowLeft />
            </i>
            Pedido #{currentOrder.id}
          </h3>
          <div className="data-order">
            <label>Fornecedor:</label>

            <span>
              {currentOrder.cadastro.name}{" "}
              <i className="edit">
                <FaEdit />
              </i>
            </span>
          </div>
          <div className="headerOrderForm">
            <form action="">
              <div className="campo c-large">
                <label>Material:</label>
                <input
                  type="text"
                  value={inputMaterial}
                  onChange={(e) => {
                    setInputMaterial(e.target.value);
                  }}
                />
                {showMateriais && (
                  <div className="listaMateriais">
                    <ul>
                      <li>1</li>
                      <li>1</li>
                      <li>1</li>
                      <li>1</li>
                      <li>1</li>
                      <li>1</li>
                      <li>1</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="campo">
                <label>Quantidade:</label>
                <input
                  type="text"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                />
              </div>
              <div className="campo">
                <label>Preço:</label>
                <input
                  type="text"
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                />
              </div>
              <div className=" c-small">
                <label>&nbsp;</label>
                <button>
                  <FaPlus />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="containerMain tableOrder">
        <table>
          <thead>
            <tr>
              <th className="material">Material</th>
              <th>Qntd</th>
              <th>Preco</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.items?.map((item) => (
              <>
                <tr>
                  <td className="material">{item.material}</td>
                  <td>{item.amount.toFixed(1)}</td>
                  <td>{item.price.toFixed(2).replace(".", ",")}</td>
                  <td>
                    {(item.amount * item.price).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text">Valor total</td>
              <td className="td-ativo">{totalAmount}</td>
              <td></td>
              <td className="td-ativo">R$ {totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button>Excluir</button>
      <button>Finalizar Pedido</button>
    </>
  );
}
