import { prisma } from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

const create = async (dataInput) => {
  const categoria = await prisma.categorias.findUnique({
    where: {
      id: dataInput.categoria_id,
    },
  });

  if (!categoria) {
    throw new NotFoundError("A categoria informada não existe.");
  }
  dataInput.nome = dataInput.nome.toUpperCase();
  const materialExistente = await prisma.material.findFirst({
    where: {
      nome: dataInput.nome.toUpperCase(),
    },
  });
  if (materialExistente) {
    throw new ValidationError("O material já existe");
  }
  const newMaterial = await prisma.material.create({
    data: {
      nome: dataInput.nome,
      preco_venda: dataInput.preco_venda,
      categoria_id: dataInput.categoria_id,
    },
    include: {
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });
  return newMaterial;
};
const update = async (data, id) => {
  if (data.categoria_id) {
    const categoria = await prisma.categorias.findUnique({
      where: {
        id: data.categoria_id,
      },
    });

    if (!categoria) {
      throw new ValidationError("A categoria informada não existe.");
    }
  }

  const materialAtual = await prisma.material.findUnique({
    where: {
      id,
    },
  });
  if (!materialAtual) {
    throw new NotFoundError(
      "Não foi possível encontrar o material com o id informado.",
    );
  }
  const materialComMesmoNome = await prisma.material.findFirst({
    where: {
      nome: data.nome ? data.nome.toUpperCase() : undefined,
      id: {
        not: id,
      },
    },
  });

  if (materialComMesmoNome) {
    throw new ValidationError("O material já existe.");
  }
  const updatedMaterial = await prisma.material.update({
    where: {
      id,
    },
    data: {
      nome: data.nome ? data.nome.toUpperCase() : materialAtual.nome,
      preco_venda: data.preco_venda || materialAtual.preco_venda,
      categoria_id: data.categoria_id || materialAtual.categoria_id,
      atualizado_em: new Date(),
      status: data.status !== undefined ? data.status : materialAtual.status,
    },
    include: {
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  return updatedMaterial;
};
const findById = async (id) => {
  const material = await prisma.material.findUnique({
    where: {
      id,
    },
    include: {
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  if (!material) {
    throw new NotFoundError(
      "Não foi possível encontrar o material com o id informado.",
    );
  }

  return material;
};
const findAll = async () => {
  const materiais = await prisma.material.findMany({
    include: {
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  return materiais;
};

const material = {
  create,
  update,
  findById,
  findAll,
};
export default material;
