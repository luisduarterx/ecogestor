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
          <span>Nome do modal</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal"></div>
        <div className="end-modal">
          <button className="button-end-modal">End</button>
        </div>
      </div>
    </div>
  );
}
