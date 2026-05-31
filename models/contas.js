import { prisma } from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

const create = async ({ nome, saldo_inicial, status }) => {
  try {
    const conta = await prisma.conta_financeira.create({
      data: {
        nome: nome.toUpperCase(),
        saldo_inicial,
        status: status ?? true,
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
const findById = async (id) => {
  const conta = await prisma.conta_financeira.findFirst({
    where: {
      id,
    },
  });

  if (!conta) {
    throw new NotFoundError(
      "Não foi possível encontrar a conta com o id informado.",
    );
  }
  return {
    id: conta.id,
    nome: conta.nome,
    saldo_inicial: Number(conta.saldo_inicial),
    saldo_atual: Number(conta.saldo_atual),
    status: conta.status,
    criado_em: conta.criado_em.toISOString(),
    atualizado_em: conta.atualizado_em.toISOString(),
  };
};
const update = async ({ id, nome, status }) => {
  try {
    const conta = await prisma.conta_financeira.update({
      where: {
        id,
      },
      data: {
        nome: nome ? nome.toUpperCase() : undefined,
        status,
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
    if (error.code === "P2025") {
      throw new NotFoundError(
        "Não foi possível encontrar a conta com o id informado.",
      );
    }
    if (error.code === "P2002") {
      throw new ValidationError("A conta já existe.");
    }
    throw error;
  }
};
const contas = {
  create,
  getAll,
  findById,
  update,
};
export default contas;
