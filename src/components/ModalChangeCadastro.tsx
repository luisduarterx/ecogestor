import "@/app/modal.css";
import { FaX } from "react-icons/fa6";
export default function ChangeRegister() {
  return (
    <div className="bg-blocked">
      <div className="modal middle">
        <div className="head-modal">
          <span>Texto</span>
          <i>
            <FaX />
          </i>
        </div>
        <div className="campo w-100">
          <label>Fornecedor:</label>
          <input type="text"></input>
          <div>
            <ul>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="end-modal">
          <button>Salvar Alteracão</button>
        </div>
      </div>
    </div>
  );
}
