import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { useState } from "react";
type Props = {
  close: () => void;
};
export default function LancamentoAvulso({ close }: Props) {
  const [inputCheckbox, setInputCheckbox] = useState(true); // se checkbox == true será entrada se == false será saída

  const changeOption = (x: number) => {
    if (x === 0) {
      setInputCheckbox(false);
    } else if (x === 1) {
      setInputCheckbox(true);
    }
  };
  return (
    <div className="bg-blocked">
      <div className="modal">
        <div className="head-modal">
          <span>Lançamento Avulso</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="modal-two-btns">
            <input type="checkbox" className="hidden" checked={inputCheckbox} />
            <div
              className={`${
                inputCheckbox ? "btn-active" : "btn-disabled"
              } btn-escolha`}
              onClick={() => changeOption(1)}
            >
              Entrada
            </div>
            <div
              className={`${
                !inputCheckbox ? "btn-active" : "btn-disabled"
              } btn-escolha`}
              onClick={() => changeOption(0)}
            >
              Saida
            </div>
          </div>
          <div className="label-input">
            <label>Quantidade</label>
            <input type="number" />
          </div>
          <div className="label-input">
            <label>Material:</label>
            <select>
              <option>Material X</option>
            </select>
          </div>
        </div>
        <div className="end-modal">
          <button className="button-end-modal">End</button>
        </div>
      </div>
    </div>
  );
}
