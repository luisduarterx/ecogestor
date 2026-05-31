import { prisma } from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

const create = async ({ nome, saldo_inicial }) => {
  try {
    const conta = await prisma.conta_financeira.create({
      data: {
        nome: nome.toUpperCase(),
        saldo_inicial,
        saldo_atual: saldo_inicial,
      },
    });

    return {
      id: conta.id,
      nome: conta.nome,
      saldo_inicial: Number(conta.saldo_inicial),
      saldo_atual: Number(conta.saldo_atual),
      status: conta.status,
      criado_em: conta.criado_em.toISOString(),
      atualizado_em: conta.atualizado_em.toISOString(),
    };
  } catch (error) {
    if (error.code === "P2002") {
      throw new ValidationError("A conta já existe");
    }
    throw error;
  }
};
const getAll = async ({ nome, ordem }) => {
  const where = {};
  if (nome) {
    where.nome = {
      contains: nome.toUpperCase(),
      mode: "insensitive",
    };
  }
  const contas = await prisma.conta_financeira.findMany({
    where,
    orderBy: {
      nome: ordem === "desc" ? "desc" : "asc",
    },
  });

  return contas.map((conta) => ({
    id: conta.id,
    nome: conta.nome,
    saldo_inicial: Number(conta.saldo_inicial),
    saldo_atual: Number(conta.saldo_atual),
    status: conta.status,
    criado_em: conta.criado_em.toISOString(),
    atualizado_em: conta.atualizado_em.toISOString(),
  }));
};
const contas = {
  create,
  getAll,
};
export default contas;
