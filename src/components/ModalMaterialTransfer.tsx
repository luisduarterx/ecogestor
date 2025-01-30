import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
type Props = {
  close: () => void;
};
export default function MaterialTransfer({ close }: Props) {
  return (
    <div className="bg-blocked">
      <div className="modal">
        <div className="head-modal">
          <span>Transferencia de Material</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="label-input">
            <label>Material a RETIRAR:</label>
            <select>
              <option>Material X</option>
            </select>
          </div>

          <div className="label-input">
            <label>Quantidade:</label>
            <input type="number" />
          </div>
          <div className="label-input">
            <label>Material a ADICIONAR:</label>
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
