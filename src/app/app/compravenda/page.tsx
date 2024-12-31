"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

export default function Page() {
  type lista = {
    id: number;
    name: string;
  };
  const lista = [
    { id: 19, name: "FERNANDA DUARTE SOUZA" },
    { id: 88, name: "CARLA COSTA DUARTE" },
    { id: 83, name: "MARIA ALVES ALVES" },
    { id: 23, name: "FERNANDA SOUZA PEREIRA" },
    { id: 82, name: "PEDRO PEREIRA ALVES" },
    { id: 28, name: "PATRICIA PEREIRA ROCHA" },
    { id: 56, name: "MARIA SANTOS ROCHA" },
    { id: 51, name: "PAULO DUARTE SANTOS" },
    { id: 53, name: "FERNANDA DUARTE SOUZA" },
    { id: 17, name: "ANA COSTA LIMA" },
    { id: 80, name: "CARLA SANTOS SOUZA" },
    { id: 58, name: "ANA SANTOS DUARTE" },
    { id: 24, name: "MARIA SOUZA OLIVEIRA" },
    { id: 22, name: "CARLA DUARTE ROCHA" },
    { id: 10, name: "LUIS DUARTE ROCHA" },
    { id: 27, name: "PAULO SILVA LIMA" },
    { id: 77, name: "ANA SANTOS ALVES" },
    { id: 62, name: "LUIS SILVA PEREIRA" },
    { id: 73, name: "PEDRO SOUZA OLIVEIRA" },
    { id: 49, name: "ANTONIO SILVA DUARTE" },
    { id: 64, name: "ANTONIO PEREIRA OLIVEIRA" },
    { id: 100, name: "ANA DUARTE SOUZA" },
    { id: 54, name: "JOSE ALVES ALVES" },
    { id: 67, name: "PATRICIA COSTA ROCHA" },
    { id: 11, name: "ANA SOUZA ROCHA" },
    { id: 31, name: "MARIA COSTA ALVES" },
    { id: 85, name: "MARIA SANTOS SOUZA" },
    { id: 71, name: "CARLA PEREIRA OLIVEIRA" },
    { id: 61, name: "MARIA ALVES PEREIRA" },
    { id: 26, name: "PATRICIA OLIVEIRA PEREIRA" },
    { id: 78, name: "PAULO ALVES ROCHA" },
    { id: 6, name: "ANA OLIVEIRA ALVES" },
    { id: 33, name: "ANTONIO OLIVEIRA COSTA" },
    { id: 40, name: "ANA ROCHA OLIVEIRA" },
    { id: 55, name: "FERNANDA COSTA OLIVEIRA" },
    { id: 69, name: "JOSE DUARTE PEREIRA" },
    { id: 36, name: "ANA COSTA PEREIRA" },
    { id: 66, name: "PATRICIA ALVES SOUZA" },
    { id: 47, name: "ANTONIO PEREIRA PEREIRA" },
    { id: 45, name: "FERNANDA LIMA SOUZA" },
    { id: 93, name: "PEDRO OLIVEIRA SOUZA" },
    { id: 30, name: "PATRICIA COSTA ROCHA" },
    { id: 20, name: "JOSE SOUZA LIMA" },
    { id: 96, name: "PAULO SILVA COSTA" },
    { id: 75, name: "FERNANDA LIMA SILVA" },
    { id: 14, name: "ANA ALVES COSTA" },
    { id: 60, name: "PATRICIA PEREIRA SANTOS" },
    { id: 29, name: "LUIS ALVES OLIVEIRA" },
    { id: 42, name: "CARLA OLIVEIRA ALVES" },
    { id: 90, name: "CARLA LIMA COSTA" },
    { id: 11111, name: "PORTAO COMPRAS" },
  ];
  const [transation, setTransation] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<lista[] | null>(null);
  const [searchSelected, setSearchSelected] = useState(false);

  useEffect(() => {
    // Atualizar a lista filtrada quando inputSearch muda
    let filter: lista[] = [];
    if (inputSearch.trim() === "") {
      setSearchFilter(null);
      return;
    }

    filter = lista.filter((item) => {
      if (inputSearch === "*") {
        return lista;
      }

      return (
        item.id.toString() === inputSearch.trim() || // Comparação exata para o ID
        item.name.toUpperCase().includes(inputSearch.toUpperCase()) // Busca parcial para nomes
      );
    });
    if (filter.length < 1) {
      setSearchFilter(null);
      return;
    }
    setSearchFilter(filter);
  }, [inputSearch]); // Dependência para executar quando inputSearch mudar

  return (
    <div className="container">
      <h1 className="pageTitle">Compra e Venda</h1>
      <div className="containerMain">
        <div className="mainHeader">
          <div className="headerSelectTransation">
            <h2>Nova Transaçao</h2>
            <input
              style={{ display: "none" }}
              type="checkbox"
              checked={transation}
              onChange={() => {
                setTransation(!transation);
              }}
            />

            <div
              className={` ${transation ? "compra" : "venda"} selectTransation`}
              onClick={() => {
                setTransation(!transation);
              }}
            >
              <div className="option">{transation ? "Compra" : "Venda"}</div>
            </div>
          </div>
          <div className="inputSelectTransation">
            <label>{transation ? "Fornecedor:" : "Cliente:"}</label>
            <div
              className={`inputGroupTransation ${inputFocus && "inputFocus"}`}
            >
              <input
                className="inputboxTransation"
                onFocus={() => {
                  setInputFocus(!inputFocus);
                }}
                onChange={(e) => {
                  setInputSearch(e.target.value);
                }}
                value={inputSearch}
                type="text"
              />
              <FaSearch className="fa-search-gray" />
            </div>
            <i>
              <FaPlus className="fa-plus-green" />
            </i>
          </div>
          {searchFilter ? (
            <div className="listSearch">
              <ul>
                {searchFilter?.map((item) => (
                  <>
                    {!searchFilter && <li>Nao encontrado</li>}
                    <li>{item.name}</li>
                  </>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="containerMain">a</div>
    </div>
  );
}
