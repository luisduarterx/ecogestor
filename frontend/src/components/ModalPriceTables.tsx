import { FaX } from "react-icons/fa6";
import "@/app/modal.css";
import { FaPlusCircle, FaPrint, FaShoePrints, FaTrash } from "react-icons/fa";
import { Array_materiais } from "@/app/auxiliar/materiais";
import { useState } from "react";
type Props = {
  close: () => void;
};
export default function PriceTables({ close }: Props) {
  const [selectTable, setSelectTable] = useState<string | number>("");
  const [selectMaterial, setSelectMaterial] = useState<string | number>("");
  const [inputValorCompra, setValorCompra] = useState<string | number>("");
  return (
    <div className="bg-blocked">
      <div className=" modal  m-small">
        <div className="head-modal">
          <span>Tabelas de Preços</span>
          <i>
            <FaX onClick={close} />
          </i>
        </div>
        <div className="body-modal">
          <div className="label-input total">
            <label>Tabela:</label>
            <select
              value={selectTable}
              onChange={(e) => {
                setSelectTable(e.target.value);
              }}
            >
              <option value={""}>Padrão</option>
              <option value={1}>Atacado</option>
              <option value={2}>Catador</option>
              <option value={3}>Coleta</option>
            </select>
          </div>
          <div className="tables">
            {selectTable !== "" && (
              <div className="t-head">
                <div className="label-input flex-2">
                  <label>Material</label>

                  <select
                    value={selectMaterial}
                    onChange={(e) => setSelectMaterial(e.target.value)}
                  >
                    <option value={""}>Selecione o material</option>
                    {Array_materiais.map((item, key) => (
                      <option value={item.id} key={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="label-input flex-1">
                  <label>$ Compra</label>
                  <input
                    type="text"
                    value={inputValorCompra}
                    onChange={(e) => setValorCompra(e.target.value)}
                  ></input>
                </div>

                <i className="flex-03">
                  <FaPlusCircle />
                </i>
              </div>
            )}

            <table className="listMaterialsTable">
              <tr>
                <td className="flex-2 false-input">
                  Estamparia de Aluminio Suja
                </td>
                <input className=" flex-1 " type="text" />
                <td className="flex-03 btn-tables">
                  <FaTrash />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="end-modal">
          <i>
            <FaPrint />
          </i>
          <button className="button-end-modal">Salvar</button>
        </div>
      </div>
    </div>
  );
}
