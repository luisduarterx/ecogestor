import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
type Props = {
  close: () => void;
};
export default function MaterialCategory({ close }: Props) {
  return (
    <div className="bg-blocked">
      <div className="modal">
        <div className="head-modal">
          <span>Categorias</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal"></div>
        <div className="end-modal">
          <button className="button-end-modal">Finalizar</button>
        </div>
      </div>
    </div>
  );
}
