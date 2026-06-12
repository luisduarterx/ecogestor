import { prisma } from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import categoriasLancamento from "pages/api/v1/categorias-lancamento";

const create = async ({ nome, tipo_categoria }) => {
  try {
    const categoriaExistente = await prisma.categoria_lancamento.findFirst({
      where: {
        nome,
      },
    });
    if (
      categoriaExistente?.nome === nome &&
      categoriaExistente?.tipo_categoria === tipo_categoria
    ) {
      throw new ValidationError("A categoria de lançamento já existe");
    }

    const categoria = await prisma.categoria_lancamento.create({
      data: {
        nome: nome.toUpperCase(),
        tipo_categoria,
      },
    });

    return {
      id: categoria.id,
      nome: categoria.nome,
      tipo_categoria: categoria.tipo_categoria,
      criado_em: categoria.criado_em.toISOString(),
    };
  } catch (error) {
    if (error.code === "P2002") {
      throw new ValidationError("A categoria de lançamento já existe");
    }
    throw error;
  }
};
const getAll = async ({ nome }) => {
  const categorias = await prisma.categoria_lancamento.findMany({
    where: {
      nome: {
        contains: nome,
        mode: "insensitive",
      },
    },
  });

  return categorias.map((categoria) => ({
    id: categoria.id,
    nome: categoria.nome,
    tipo_categoria: categoria.tipo_categoria,
    criado_em: categoria.criado_em.toISOString(),
  }));
};
const update = async ({ id, nome }) => {
  try {
    const categoriaExistente = await prisma.categoria_lancamento.findFirst({
      where: {
        nome,
        NOT: {
          id,
        },
      },
    });
    const categoriaAtual = await prisma.categoria_lancamento.findUnique({
      where: {
        id,
      },
    });
    if (!categoriaAtual) {
      throw new NotFoundError("Categoria de lançamento não encontrada.");
    }
    if (
      categoriaExistente?.nome === nome &&
      categoriaExistente?.tipo_categoria === categoriaAtual.tipo_categoria
    ) {
      throw new ValidationError("A categoria de lançamento já existe.");
    }

    const categoria = await prisma.categoria_lancamento.update({
      where: { id },
      data: {
        nome: nome.toUpperCase(),
      },
    });

    return {
      id: categoria.id,
      nome: categoria.nome,
      tipo_categoria: categoria.tipo_categoria,
      criado_em: categoria.criado_em.toISOString(),
    };
  } catch (error) {
    if (error.code === "P2002") {
      throw new ValidationError("A categoria de lançamento já existe");
    }
    throw error;
  }
};
const categoriaLancamento = {
  create,
  getAll,
  update,
};
export default categoriaLancamento;
