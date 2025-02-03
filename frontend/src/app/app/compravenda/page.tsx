"use client";
import FormNewRegistration from "@/components/FormNewRegistration";

import { cadastro, recordType } from "@/types/types";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { lista } from "@/app/auxiliar/cadastro";

export default function Page() {
  type lista = {
    id: number;
    name: string;
  };

  const [transation, setTransation] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<lista[] | null>(null);
  const [searchSelected, setSearchSelected] = useState(false);
  const [pSelected, setPSelected] = useState<null | lista>(null);
  const [newRegistration, setNewRegistration] = useState(false);
  const [confirmSelected, setConfirmSelected] = useState(false);

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

  const selecionarPessoa = (key: number) => {
    // Selecionar uma pessoa da lista de filtro
    const pessoa: lista[] = lista.filter((item) => {
      return item.id === key;
    });
    console.log(pessoa[0]);
    setPSelected(pessoa[0]);
    setSearchFilter(null);
    setInputSearch("");
    console.log(pSelected);
  };

  const closeNewRegistration = () => {
    //fechar aba de cadastro
    setNewRegistration(false);
  };
  const closeNotSelected = () => {
    //fechar aba confiormacao
    setConfirmSelected(false);
  };
  const newOrderPage = () => {
    if (!pSelected) {
      setPSelected(lista[0]);
      return;
    }
    // requisicao de novo pedido e redireciona para pagina do novo pedido
  };

  const validarCadastro = (NewData: cadastro, recordType: recordType) => {
    //fazer validacao de cadastro e query ao banco de dados
    alert(`tipo de cadastro : ${recordType}`);
    console.log(NewData);
  };
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
            {newRegistration && (
              <FormNewRegistration
                recordType={transation ? "fornecedor" : "cliente"}
                closeModal={closeNewRegistration}
                validarCadastro={validarCadastro}
              />
            )}
            <label>{transation ? "Fornecedor:" : "Cliente:"}</label>
            <div
              className={`inputGroupTransation ${inputFocus && "inputFocus"}`}
            >
              {!pSelected ? (
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
              ) : (
                <div className="pSelected">
                  {pSelected.id}-{pSelected.name}
                  <i
                    onClick={(e) => {
                      console.log(e.target);
                      setPSelected(null);
                    }}
                  >
                    <FaX />
                  </i>
                </div>
              )}

              {!pSelected && <FaSearch className="fa-search-gray" />}

              <FaPlus
                className="fa-plus-green"
                onClick={() => setNewRegistration(true)}
              />
            </div>
            <button className="btn" onClick={newOrderPage}>
              Novo Pedido
            </button>
          </div>
          {searchFilter ? (
            <div className="listSearch">
              <ul>
                {searchFilter?.map((item) => (
                  <>
                    {!searchFilter && <li>Nao encontrado</li>}
                    <li
                      onClick={() => {
                        console.log(item.id);
                        selecionarPessoa(item.id);
                      }}
                    >
                      {item.id} - {item.name}
                    </li>
                  </>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="containerMain">
        <div className="headerOrders">
          <h2>Ultimos pedidos</h2>
        </div>
        <div className="mainOrders">
          <table className="listOrders">
            <tr>
              <th>Tipo</th>
              <th>Fornecedor/Cliente</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Luis Claudio Duarte</td>
              <td>123.54</td>
              <td>Hoje, 12:47</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Maria Fernanda Silva</td>
              <td>234.90</td>
              <td>Hoje, 11:15</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>João Carlos Ribeiro</td>
              <td>987.30</td>
              <td>Ontem, 18:20</td>
              <td className="td-status">
                <span className="td-atrasado">ATRASADO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Ana Beatriz Santos</td>
              <td>450.00</td>
              <td>Ontem, 15:45</td>
              <td className="td-status">
                <span className="td-pendente">PENDENTE</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Rafael Almeida</td>
              <td>320.45</td>
              <td>05/01/2025, 10:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Gabriel Souza</td>
              <td>150.00</td>
              <td>04/01/2025, 14:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Lucas Pereira</td>
              <td>580.90</td>
              <td>03/01/2025, 13:30</td>
              <td className="td-status">
                <span className="td-atrasado">ATRASADO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Juliana Oliveira</td>
              <td>720.00</td>
              <td>02/01/2025, 09:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Felipe Machado</td>
              <td>300.45</td>
              <td>01/01/2025, 16:30</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Camila Duarte</td>
              <td>410.25</td>
              <td>31/12/2024, 10:15</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Pedro Henrique</td>
              <td>550.10</td>
              <td>30/12/2024, 17:00</td>
              <td className="td-status">
                <span className="td-atrasado">ATRASADO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Sofia Lima</td>
              <td>130.00</td>
              <td>29/12/2024, 14:40</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Gustavo Almeida</td>
              <td>200.60</td>
              <td>28/12/2024, 09:50</td>
              <td className="td-status">
                <span className="td-pendente">PENDENTE</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Laura Nogueira</td>
              <td>340.75</td>
              <td>27/12/2024, 11:30</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Marcos Silva</td>
              <td>710.85</td>
              <td>26/12/2024, 15:10</td>
              <td className="td-status">
                <span className="td-atrasado">ATRASADO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Carla Sousa</td>
              <td>285.90</td>
              <td>25/12/2024, 13:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Eduardo Costa</td>
              <td>600.50</td>
              <td>24/12/2024, 16:20</td>
              <td className="td-status">
                <span className="td-pendente">PENDENTE</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Bianca Rocha</td>
              <td>820.40</td>
              <td>23/12/2024, 12:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Compra</td>
              <td>Rodrigo Mota</td>
              <td>470.00</td>
              <td>22/12/2024, 09:15</td>
              <td className="td-status">
                <span className="td-pendente">PENDENTE</span>
              </td>
            </tr>
            <tr>
              <td className="td-type">Venda</td>
              <td>Isabela Fernandes</td>
              <td>500.00</td>
              <td>21/12/2024, 14:00</td>
              <td className="td-status">
                <span className="td-pago">PAGO</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}
