import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { useState } from "react";
type Props = {
  close: () => void;
};
export default function NewMaterial({ close }: Props) {
  const [inputMaterial, setInputMaterial] = useState("");
  const [inputCompra, setInputCompra] = useState("");
  const [inputVenda, setInputVenda] = useState("");
  return (
    <div className="bg-blocked">
      <div className="modal m-small">
        <div className="head-modal">
          <span>Cadastrar material</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="label-input total">
            <label>Categoria:</label>
            <select>
              <option>Nenhum</option>
            </select>
          </div>
          <div className="label-input total">
            <label>Nome do material:</label>
            <input
              type="text"
              value={inputMaterial}
              onChange={(e) => setInputMaterial(e.target.value)}
            />
          </div>
          <div className="label-input total">
            <label>Preço de Compra:</label>
            <input
              type="text"
              value={inputCompra}
              onChange={(e) => setInputCompra(e.target.value)}
            />
          </div>
          <div className="label-input total">
            <label>Preço de Venda:</label>
            <input
              type="text"
              value={inputVenda}
              onChange={(e) => setInputVenda(e.target.value)}
            />
          </div>
        </div>
        <div className="end-modal">
          <button className="button-end-modal">Cadastrar</button>
        </div>
      </div>
    </div>
  );
}
