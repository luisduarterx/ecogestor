import "@/app/modal.css";
import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
type Props = {
  close: () => void;
  saveChange: () => void;
  item: {
    material: string;
    amount: number;
    id: number;
    orderID: number;
    price: number;
  };
};
export default function EditItems({ item, close, saveChange }: Props) {
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputAmount, setInputAmount] = useState<number | string>("");
  const [inputPrice, setInputPrice] = useState<number | string>("");
  const [inputPesoBruto, setInputPesoBruto] = useState<number | string>("");
  const [inputTara, setInputTara] = useState<number | string>("");
  const [inputImpureza, setInputImpureza] = useState<number | string>("");

  useEffect(() => {
    setInputMaterial(item.material);
    setInputAmount(item.amount);
    setInputPesoBruto(item.amount);
    setInputPrice(item.price);
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
              <input
                type="text"
                value={inputMaterial}
                onChange={(e) => setInputMaterial(e.target.value)}
              />
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
                type="text"
                value={inputPesoBruto}
                onChange={(e) => setInputPesoBruto(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Tara</label>
              <input
                type="text"
                value={inputTara}
                onChange={(e) => setInputTara(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Impureza</label>
              <input
                type="text"
                value={inputImpureza}
                onChange={(e) => setInputImpureza(e.target.value)}
              />
            </div>
            <div className="campo">
              <label>Liquido</label>
              <input type="text" value={inputAmount} />
            </div>
          </div>
        </div>
        <div className="end-modal">
          <button onClick={() => saveChange}>Salvar Alteracão</button>
        </div>
      </div>
    </div>
  );
}
