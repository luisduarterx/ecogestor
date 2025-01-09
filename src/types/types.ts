export type recordType = "cliente" | "fornecedor";

export type cadastro = {
  name: string;
  table: string;
  cpf: string;
  type: "Física" | "Jurídica";
  endereco?: dataEndereco;
  telefone1?: string;
  telefone2?: string;
  apelido?: string;
  banco?: dataBanco;
  email?: string;
  obs?: string;
};
export type dataEndereco = {
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cidade?: string;
  uf?: string;
};
export type dataBanco = {
  name?: string;
  agencia?: string;
  conta?: string;
  pix?: string;
};
