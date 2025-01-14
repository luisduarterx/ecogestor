"use client";
import { materiais, order } from "@/types/types";
import { KeyboardEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Array_materiais } from "@/app/auxiliar/materiais";
import { FaX } from "react-icons/fa6";
import ChangeRegister from "@/components/ModalChangeCadastro";
import EditItems from "@/components/ModalEditItem";
type items = {
  material: string;
  amount: number;
  id: number;
  orderID: number;
  price: number;
};
export default function Page() {
  const [showMateriais, setShowMateriais] = useState(true);
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputAmount, setInputAmount] = useState<number | string>();
  const [inputPrice, setInputPrice] = useState<number | string>();
  const [currentOrder, setCurrentOrder] = useState<order>({
    id: 4554,
    cadastro: {
      id: 45,
      name: "Luis Claudio",
    },
    items: [
      {
        material: "Perfil Limpo",
        amount: 4,
        id: 22,
        orderID: 4554,
        price: 10.5,
      },
      {
        material: "Perfil Sujo",
        amount: 19,
        id: 24,
        orderID: 4554,
        price: 4.5,
      },
      {
        material: "Cobre 2",
        amount: 2,
        id: 25,
        orderID: 4554,
        price: 41.0,
      },
    ],
    totalPrice: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [materialsFilter, setMateriaisFilter] = useState<materiais[] | null>(
    null
  );
  const [mSelected, setMSelected] = useState<materiais | null>(null);
  const [showModalRegister, setModalRegister] = useState(false);
  const [showModalEditItem, setShowModalEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState<items>();

  const closeModalRegister = () => {
    setModalRegister(false);
  };
  const saveChangeRegister = (item: { id: number; name: string }) => {
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      cadastro: item,
    }));
    setModalRegister(false);
  };
  const closeModalEditItem = () => {
    setShowModalEditItem(false);
  };
  const saveChangeItem = () => {};
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
    if (inputMaterial === "") {
      setMateriaisFilter(null);
    }
    const filter = Array_materiais.filter((item) => {
      if (inputMaterial === "") {
        return null;
      }
      return (
        item.id === Number(inputMaterial) ||
        item.name.toUpperCase().includes(inputMaterial.toUpperCase())
      );
    });

    setMateriaisFilter(filter);
  }, [inputMaterial]);
  const selecionarMaterial = (x: materiais) => {
    setMSelected(x);
    const price: number = x.price as number;
    setInputPrice(price);
    setMateriaisFilter(null);
  };
  const selectInputMaterial = (e: KeyboardEvent) => {
    if (e.key === "Enter" && materialsFilter?.length === 1) {
      selecionarMaterial(materialsFilter[0]);
      setInputMaterial("");
    }
  };
  const addItemOrder = () => {
    if (
      typeof inputPrice !== "number" ||
      !mSelected ||
      typeof inputAmount !== "number"
    ) {
      alert("Preencha os campos corretamente");
      return;
    }
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
    setInputAmount("");
    setInputPrice("");
  };
  const removeIteminOrder = (id: number) => {
    let filtro = currentOrder.items.filter((item) => {
      return item.id !== id;
    });

    setCurrentOrder((prevOrder) => ({ ...prevOrder, items: filtro }));
  };
  const editarItem = (item: items) => {
    setEditingItem(item);
    setShowModalEditItem(true);
  };
  return (
    <>
      <div className="containerMain">
        {showModalEditItem && (
          <EditItems
            item={editingItem as items}
            close={closeModalEditItem}
            saveChange={saveChangeItem}
          />
        )}
        {showModalRegister && (
          <ChangeRegister
            saveChange={saveChangeRegister}
            close={closeModalRegister}
          />
        )}

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
              <i className="edit" onClick={() => setModalRegister(true)}>
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
                        setInputPrice("");
                      }}
                    >
                      <FaX />
                    </i>
                  </span>
                ) : (
                  <>
                    <input
                      type="text"
                      autoFocus
                      value={inputMaterial}
                      onChange={(e) => {
                        setInputMaterial(e.target.value);
                      }}
                      onKeyDown={(e) => selectInputMaterial(e)}
                    />
                    {materialsFilter && (
                      <div className="listaMateriais">
                        <ul>
                          {materialsFilter?.map((item, key) => (
                            <li
                              key={key}
                              onClick={() => selecionarMaterial(item)}
                            >
                              {" "}
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
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
              <th>Açao</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.items?.map((item) => (
              <>
                <tr className="line">
                  <td className="material">{item.material}</td>
                  <td>{item.amount.toFixed(1)}</td>
                  <td>{item.price.toFixed(2).replace(".", ",")}</td>
                  <td>
                    {(item.amount * item.price).toFixed(2).replace(".", ",")}
                  </td>
                  <td>
                    <div className="btn-actions">
                      <button
                        className="btn edit-item"
                        onClick={() => editarItem(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn delete-item"
                        onClick={() => removeIteminOrder(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
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
