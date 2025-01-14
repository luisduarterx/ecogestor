import "@/app/modal.css";
import { FaX } from "react-icons/fa6";
import { lista } from "@/app/auxiliar/cadastro";
import {
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

type Props = {
  close: () => void;
  saveChange: (item: lista) => void;
};
type lista = {
  id: number;
  name: string;
};
export default function ChangeRegister({ close, saveChange }: Props) {
  const [inputRegister, setInputRegister] = useState("");
  const [listFilter, setListFilter] = useState<lista[] | null>(null);
  const [NRSelected, setNRSelected] = useState<lista | null>(null);

  useEffect(() => {
    if (inputRegister === "") {
      return setListFilter(null);
    }

    const Filtro = lista.filter((item) => {
      return (
        item.id.toString().toUpperCase() === inputRegister.toUpperCase() ||
        item.name.toUpperCase().includes(inputRegister.toUpperCase())
      );
    });
    console.log(Filtro);
    setListFilter(Filtro);
  }, [inputRegister]);

  const selecionarNRegister = (item: lista) => {
    setNRSelected(item);
    setInputRegister("");
    setListFilter(null);
  };

  const selectOption = (e: KeyboardEvent) => {
    // Função para registrar a tecla enter como escolha de opcao em drop-list
    if (e.key === "Enter" && listFilter?.length === 1) {
      setNRSelected(listFilter[0]);
      setInputRegister("");
      return;
    }
  };

  return (
    <div className="bg-blocked">
      <div className="modal middle">
        <div className="head-modal">
          <span>Texto</span>
          <i onClick={close}>
            <FaX />
          </i>
        </div>
        <div className="body-modal">
          <div className="campo w-100 relative">
            <label>Fornecedor:</label>
            {NRSelected ? (
              <span>
                {NRSelected.id}-{NRSelected.name}
                <i onClick={() => setNRSelected(null)}>
                  <FaX />
                </i>
              </span>
            ) : (
              <input
                type="text"
                value={inputRegister}
                onChange={(e) => setInputRegister(e.target.value)}
                onKeyDown={(e) => selectOption(e)}
              ></input>
            )}

            {listFilter && (
              <div className="drop-list">
                <ul>
                  {listFilter?.map((item, key) => (
                    <li key={key} onClick={() => selecionarNRegister(item)}>
                      {item.id} - {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="end-modal">
          <button onClick={() => saveChange(NRSelected as lista)}>
            Salvar Alteracão
          </button>
        </div>
      </div>
    </div>
  );
}
