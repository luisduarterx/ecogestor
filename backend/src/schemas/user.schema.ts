import z from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  senha: z.string().min(4),
  telefone: z.string(),
  rankID: z.number().default(1),
});

export const userEditSchema = z.object({
  id: z.number(),
  data: userSchema,
});
export const userDeleteSchema = z.number();

export const rankSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
});
export const registerSchema = z.object({
  id: z.number(),
  nome_razao: z.string().min(4).toUpperCase(),
  cpf_cnpj: z.string().min(11),
  ie: z.string().optional(),
  apelido: z.string().toUpperCase().optional(),
  tipo: z.enum(["FISICA", "JURIDICA"]),
  tabelaID: z.number().default(1),
  dadosPG: z
    .object({
      id: z.number(),
      banco: z.string(),
      agencia: z.string().optional(),
      conta: z.string().optional(),
      chave: z.string().optional(),
      cpf: z.string().optional(),
      registerID: z.number(),
    })
    .optional(),
  email: z.string().email().optional(),
  endereco: z
    .object({
      id: z.number(),
      registerID: z.number(),
      estado: z.string(),
      cidade: z.string(),
      bairro: z.string(),
      logradouro: z.string(),
      numero: z.string(),
      complemento: z.string(),
    })
    .optional(),
  telefone: z.string().min(8),
});
