import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { FaPrint, FaShoePrints } from "react-icons/fa";
type Props = {
  close: () => void;
};
export default function PriceTables({ close }: Props) {
  return (
    <div className="bg-blocked">
      <div className="modal">
        <div className="head-modal">
          <span>Tabelas de Preços</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal"></div>
        <div className="end-modal">
          <i>
            <FaPrint />
          </i>
          <button className="button-end-modal">End</button>
        </div>
      </div>
    </div>
  );
}
