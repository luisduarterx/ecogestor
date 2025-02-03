import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
type Props = {
  close: () => void;
};
export default function MaterialCategory({ close }: Props) {
  return (
    <div className="bg-blocked">
      <div className="modal m-small ">
        <div className="head-modal">
          <span>Categorias</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="tables">
            <div className="t-head">
              <div className="label-input w-90 ">
                <label>Nova Categoria</label>

                <input type="text" />
              </div>

              <i className="flex-03">
                <FaPlusCircle />
              </i>
            </div>

            <table className="listMaterialsTable">
              <thead>
                <th>Categorias</th>
              </thead>
              <tr>
                <td className="false-input ">Aluminios</td>

                <td className="flex-03 btn-tables">
                  <FaTrash />
                </td>
              </tr>
              <tr>
                <td className="false-input ">Plasticos</td>

                <td className="flex-03 btn-tables">
                  <FaTrash />
                </td>
              </tr>
              <tr>
                <td className="false-input ">Ferrosos</td>

                <td className="flex-03 btn-tables">
                  <FaTrash />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="end-modal">
          <button className="button-end-modal">Finalizar</button>
        </div>
      </div>
    </div>
  );
}
