import "@/app/modal.css";
import { materiais_order } from "@/types/types";
import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
type Props = {
  close: () => void;
  saveChange: (item: materiais_order) => void;
  item: materiais_order;
};
export default function EditItems({ item, close, saveChange }: Props) {
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputPrice, setInputPrice] = useState<number | string>("");
  const [inputPesoBruto, setInputPesoBruto] = useState<number | string>("");
  const [inputTara, setInputTara] = useState<number | string>("");
  const [inputImpureza, setInputImpureza] = useState<number | string>("");

  const calcularAmount = () => {
    const bruto = Number(inputPesoBruto) || 0;
    const tara = Number(inputTara) || 0;
    const impureza = Number(inputImpureza) || 0;
    return bruto - tara - impureza > 0 ? bruto - tara - impureza : 0;
  };
  const saveEdit = () => {
    const tara = Number(inputTara) || 0;
    const impureza = Number(inputImpureza) || 0;
    const price = Number(inputPrice);

    const ItemEdited: materiais_order = {
      id: item.id,
      material: inputMaterial,
      price: price,
      orderID: item.orderID,
      tara: tara,
      impureza: impureza,
      amount: calcularAmount(),
    };

    if (ItemEdited.amount === 0) {
      alert("Erro");
      return;
    }

    saveChange(ItemEdited);
  };

  useEffect(() => {
    setInputMaterial(item.material);
    setInputPrice(item.price);
    //sempre

    if (!item.tara && !item.impureza) {
      setInputPesoBruto(item.amount);
    }

    if (item.tara && item.impureza) {
      setInputPesoBruto(item.amount + item.impureza + item.tara);
      setInputImpureza(item.impureza);
      setInputTara(item.tara);
      return;
    }
    if (item.tara) {
      setInputTara(item.tara);
      setInputPesoBruto(item.amount + item.tara);
    }
    if (item.impureza) {
      setInputImpureza(item.impureza);
      setInputPesoBruto(item.amount + item.impureza);
    }
  }, [item]);
  useEffect;

  return (
    <div className="bg-blocked">
      <div className="modal small">
        <div className="head-modal">
          <span>Editar Item do Pedido</span>
          <i onClick={close}>
            <FaX />
          </i>
        </div>
        <div className="body-modal">
          <div className="editGroupItem">
            <div className="campo large">
              <label>Material</label>
              <span>{item.material}</span>
            </div>
            <div className="campo ">
              <label>Preço</label>
              <input
                type="number"
                value={inputPrice}
                onChange={(e) => setInputPrice(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Peso Bruto</label>
              <input
                type="number"
                value={inputPesoBruto}
                onChange={(e) => setInputPesoBruto(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Tara</label>

              <input
                type="number"
                value={inputTara}
                onChange={(e) => setInputTara(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Impureza(kg)</label>
              <input
                type="number"
                value={inputImpureza}
                onChange={(e) => setInputImpureza(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="end-modal">
          <button className="button-end-modal" onClick={() => saveEdit()}>
            Salvar Alteracão
          </button>
        </div>
      </div>
    </div>
  );
}
