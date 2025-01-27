import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { useState } from "react";
type Props = {
  close: () => void;
};
export default function CreateTable({ close }: Props) {
  const [inputTable, setInputTable] = useState("");
  return (
    <div className="bg-blocked">
      <div className="modal middle m-small">
        <div className="head-modal">
          <span>Criar nova Tabela</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="label-input">
            <label>Nome da tabela</label>
            <input
              type="text"
              value={inputTable}
              onChange={(e) => setInputTable(e.target.value)}
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
