"use client";
import "@/app/modal.css";
import { cadastro, recordType } from "@/types/types";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
type Props = {
  recordType: recordType;
  closeModal: () => void;
  validarCadastro: (x: cadastro, recordType: recordType) => void;
};
// UTILIZAR API DE BUSCA DE CNPJ EM BREVE
// https://api.cnpjs.dev/v1/43736082000140
export default function FormNewRegistration({
  recordType,
  closeModal,
  validarCadastro,
}: Props) {
  const cadastrarNew = () => {
    validarCadastro(New, recordType);
    closeModal();
  };
  const close = () => {
    closeModal();
  };
  let data;
  if (recordType === "fornecedor") {
    data = {
      title: "Fornecedores",
    };
  } else if (recordType === "cliente") {
    data = {
      title: "Clientes",
    };
  }
  const [New, setNew] = useState<cadastro>({
    name: "",
    table: "",
    cpf: "",
    type: "Física",
  });
  return (
    <div className="bg-blocked">
      <div className="modal">
        <div className="head-modal">
          <span>Cadastro de {data?.title}</span>
          <i className="close btn" onClick={close}>
            <FaX />
          </i>
        </div>
        <div className="body-modal">
          <form>
            <span className="campo">
              <label>Tipo:</label>
              <select
                value={New.type}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    type: e.target.value as "Física" | "Jurídica",
                  }));
                }}
              >
                <option>Física</option>
                <option>Jurídica</option>
              </select>
            </span>
            <span className="campo large">
              <label>
                {New.type === "Física" ? "Nome Completo" : "Razão Social"}:
              </label>
              <input
                type="text"
                value={New.name}
                onChange={(e) => {
                  setNew((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </span>
            <span className="campo large">
              <label>{New.type === "Física" ? "CPF" : "CNPJ"}:</label>
              <input
                type="text"
                value={New.cpf}
                onChange={(e) => {
                  setNew((prev) => ({ ...prev, cpf: e.target.value }));
                }}
              />
            </span>
            <span className="campo">
              <label>
                {New.type === "Física" ? "Apelido" : "Nome Fantasia"}:
              </label>
              <input
                type="text"
                value={New.apelido}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    apelido: e.target.value,
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Tabela de Preços:</label>
              <select
                onChange={(e) => {
                  setNew((prev) => ({ ...prev, table: e.target.value }));
                }}
              >
                <option>Padrao</option>
              </select>
            </span>

            <span className="campo">
              <label>CEP:</label>
              <input
                type="text"
                value={New.endereco?.cep}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { cep: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo large">
              <label>Logradouro</label>
              <input
                type="text"
                value={New.endereco?.logradouro}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { logradouro: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Numero:</label>
              <input
                type="text"
                value={New.endereco?.numero}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { numero: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Bairro:</label>
              <input
                type="text"
                value={New.endereco?.bairro}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { bairro: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Complemento:</label>
              <input
                type="text"
                value={New.endereco?.complemento}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { complemento: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Cidade:</label>
              <input
                type="text"
                value={New.endereco?.cidade}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { cidade: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo small">
              <label>UF:</label>
              <input
                type="text"
                value={New.endereco?.uf}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    endereco: { uf: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo large">
              <label>Email:</label>
              <input
                type="text"
                value={New.email}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Telefone 1:</label>
              <input
                type="text"
                value={New.telefone1}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    telefone1: e.target.value,
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Telefone 2:</label>
              <input
                type="text"
                value={New.telefone2}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    telefone2: e.target.value,
                  }));
                }}
              />
            </span>

            <span className="campo">
              <label>Banco:</label>
              <input
                type="text"
                value={New.banco?.name}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    banco: { name: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Agencia:</label>
              <input
                type="text"
                value={New.banco?.agencia}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    banco: { agencia: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Conta:</label>
              <input
                type="text"
                value={New.banco?.conta}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    banco: { conta: e.target.value },
                  }));
                }}
              />
            </span>
            <span className="campo">
              <label>Chave Pix:</label>
              <input
                type="text"
                value={New.banco?.pix}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    banco: { pix: e.target.value },
                  }));
                }}
              />
            </span>

            <span className="campo total">
              <label>Observaçoes:</label>
              <input
                type="text"
                value={New.obs}
                onChange={(e) => {
                  setNew((prev) => ({
                    ...prev,
                    obs: e.target.value,
                  }));
                }}
              />
            </span>
          </form>
          <div className="end-modal">
            <button onClick={cadastrarNew} className="button-end-modal">
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
