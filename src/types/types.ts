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
export type groupMateriais = {
  id: number;
  name: string;
};
export type materiais = {
  id: number;
  group: string;
  name: string;
  price: number;
};
export type materiais_order = {
  material: string;
  amount: number;
  id: number;
  orderID: number;
  price: number;
  tara?: number;
  impureza?: number;
};
export type order = {
  id: number;
  typeOrder: "buy" | "sell";
  cadastro: { id: number; name: string };
  items: materiais_order[];
  totalPrice: number | 0;
};
