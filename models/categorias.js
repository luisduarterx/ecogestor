import { prisma } from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";
const create = async (data) => {
  const existingCategory = await prisma.categorias.findFirst({
    where: {
      nome: data.nome.toUpperCase(),
    },
  });

  if (existingCategory) {
    throw new ValidationError("Essa categoria já existe.");
  }

  const categoria = await prisma.categorias.create({
    data: {
      nome: data.nome.toUpperCase(),
    },
  });

  return categoria;
};
const update = async (data, id) => {
  const nome = data.nome.toUpperCase();

  const categoriaAtual = await prisma.categorias.findUnique({
    where: {
      id,
    },
  });
  if (!categoriaAtual) {
    throw new NotFoundError(
      "Não foi possível encontrar a categoria com o id informado.",
    );
  }
  if (nome) {
    const existingCategory = await prisma.categorias.findFirst({
      where: {
        nome: nome,
        id: {
          not: id,
        },
      },
    });

    if (existingCategory) {
      throw new ValidationError("Essa categoria já existe.");
    }
  }

  const updatedCategoria = await prisma.categorias.update({
    where: {
      id,
    },
    data: {
      nome: data.nome ? data.nome.toUpperCase() : categoriaAtual.nome,
      atualizado_em: new Date(),
      status: data.status !== undefined ? data.status : categoriaAtual.status,
    },
  });

  return updatedCategoria;
};
const findAll = async (filtros) => {
  const where = {};

  if (filtros.nome) {
    where.nome = {
      contains: filtros.nome ? filtros.nome.toUpperCase() : undefined,
      mode: "insensitive",
    };
  }

  const categorias = await prisma.categorias.findMany({
    where,
    orderBy: {
      nome: filtros.ordem === "desc" ? "desc" : "asc",
    },
    select: {
      id: true,
      nome: true,
      criado_em: true,
      atualizado_em: true,
      status: true,
    },
  });

  return categorias;
};
const findById = async (id) => {
  const categoria = await prisma.categorias.findUnique({
    where: {
      id,
    },
  });

  if (!categoria) {
    throw new NotFoundError(
      "Não foi possível encontrar a categoria com o id informado.",
    );
  }

  return categoria;
};
const categoria = {
  create,
  update,
  findAll,
  findById,
};

export default categoria;
