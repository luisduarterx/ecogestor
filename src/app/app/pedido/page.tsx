"use client";
import { materiais, order } from "@/types/types";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { Array_materiais } from "@/app/auxiliar/materiais";
import { FaX } from "react-icons/fa6";
import ChangeRegister from "@/components/ModalChangeCadastro";

export default function Page() {
  const [showMateriais, setShowMateriais] = useState(true);
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [inputPrice, setInputPrice] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<order>({
    id: 4554,
    cadastro: {
      id: 45,
      name: "Luis Claudio",
    },
    items: [],
    totalPrice: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [materialsFilter, setMateriaisFilter] = useState<materiais[]>([]);
  const [mSelected, setMSelected] = useState<materiais | null>(null);

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

  useEffect(() => {
    const filter = Array_materiais.filter((item) => {
      return (
        item.id.toString().trim() === inputMaterial.trim() ||
        item.name.toUpperCase().includes(inputMaterial.toUpperCase())
      );
    });

    setMateriaisFilter(filter);
  }, [inputMaterial]);
  const selecionarMaterial = (x: materiais) => {
    setMSelected(x);
    setMateriaisFilter([]);
    const price: number = x.price as number;
    setInputPrice(price);
  };
  const addItemOrder = () => {
    const newItem = {
      id: 3,
      material: mSelected?.name as string,
      orderID: currentOrder.id,
      amount: inputAmount as number,
      price: inputPrice as number,
    };
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      items: [...prevOrder.items, newItem],
    }));
    setMSelected(null);
    setInputMaterial("");
    setInputAmount(0);
    setInputPrice(0);
  };
  return (
    <>
      <div className="containerMain">
        <ChangeRegister />
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
                {mSelected ? (
                  <span className="pSelected">
                    {mSelected.name}
                    <i
                      onClick={() => {
                        setMSelected(null);
                        setInputMaterial("");
                      }}
                    >
                      <FaX />
                    </i>
                  </span>
                ) : (
                  <input
                    type="text"
                    autoFocus
                    value={inputMaterial}
                    onChange={(e) => {
                      setInputMaterial(e.target.value);
                    }}
                  />
                )}

                {materialsFilter.length !== 0 && (
                  <div className="listaMateriais">
                    <ul>
                      {materialsFilter.map((item) => (
                        <li onClick={() => selecionarMaterial(item)}>
                          {" "}
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="campo">
                <label>Quantidade:</label>
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Number(e.target.value))}
                />
              </div>
              <div className="campo">
                <label>Preço:</label>
                <input
                  type="number"
                  value={inputPrice}
                  onChange={(e) => setInputPrice(Number(e.target.value))}
                />
              </div>
              <div className=" c-small">
                <label>&nbsp;</label>
                <button type="button" onClick={addItemOrder}>
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
