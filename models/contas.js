import { prisma } from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

const create = async ({ nome, saldo_inicial, status, conta_padrao }) => {
  try {
    if (conta_padrao) {
      const contaPadraoAtiva = await prisma.conta_financeira.findFirst({
        where: {
          conta_padrao: true,
        },
      });
      if (contaPadraoAtiva) {
        throw new ValidationError(
          "Já existe uma conta padrão. Só é permitido uma conta padrão ativada.",
        );
      }
    }
    const conta = await prisma.conta_financeira.create({
      data: {
        nome: nome.toUpperCase(),
        saldo_inicial,
        status: status ?? true,
        saldo_atual: saldo_inicial,
        conta_padrao: conta_padrao ?? false,
      },
    });

    return {
      id: conta.id,
      nome: conta.nome,
      saldo_inicial: Number(conta.saldo_inicial),
      saldo_atual: Number(conta.saldo_atual),
      status: conta.status,
      conta_padrao: conta.conta_padrao,
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
const update = async ({ id, nome, status, conta_padrao }) => {
  try {
    if (conta_padrao === true) {
      const contaPadraoAtiva = await prisma.conta_financeira.findFirst({
        where: {
          conta_padrao: true,
          id: {
            not: id,
          },
        },
      });
      console.log("Conta padrão ativa encontrada:", contaPadraoAtiva);
      if (contaPadraoAtiva) {
        throw new ValidationError(
          "Já existe uma conta padrão. Só é permitido uma conta padrão ativada.",
        );
      }
    }
    const conta = await prisma.conta_financeira.update({
      where: {
        id,
      },
      data: {
        nome: nome ? nome.toUpperCase() : undefined,
        status,
        conta_padrao: conta_padrao !== undefined ? conta_padrao : undefined,
      },
    });

    return {
      id: conta.id,
      nome: conta.nome,
      conta_padrao: conta.conta_padrao,
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
