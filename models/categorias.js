import { prisma } from "infra/database";
import { ValidationError } from "infra/errors";
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

const categoria = {
  create,
};

export default categoria;
