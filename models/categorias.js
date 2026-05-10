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
    },
  });

  return updatedCategoria;
};

const categoria = {
  create,
  update,
};

export default categoria;
