import { NotFoundError, ValidationError } from "infra/errors";
import { prisma } from "infra/database";
import { Prisma } from "@prisma/client";

const create = async (data) => {
  try {
    const trx = await prisma.$transaction(async () => {
      const tabela = await prisma.tabela.create({
        data: {
          nome: data.nome.toUpperCase(),
        },
      });
      if (data.base) {
        const porcentagem = data.porcentagem ? data.porcentagem : 0;
        const tabelaBase = await prisma.tabela.findFirst({
          where: { id: data.base },
        });

        if (!tabelaBase) {
          throw new ValidationError(
            "Tabela base informada não existe. Verifique os dados enviados e tente novamente.",
          );
        }

        const materiaisBase = await prisma.material_tabela.findMany({
          where: {
            tabela_id: data.base,
          },
        });
        const materiaisbaseList = materiaisBase.map((material) => ({
          id: material.material_id,
          preco_compra: material.preco_compra,
        }));

        const materiaisData = materiaisbaseList.map((material) => ({
          tabela_id: tabela.id,
          material_id: material.id,
          preco_compra: material.preco_compra * (1 + porcentagem / 100),
        }));
        console.log("MATERIAIS BASE:", materiaisbaseList);
        console.log("MATERIAIS DATA:", materiaisData);

        const materiais = await prisma.material_tabela.createMany({
          data: materiaisData,
        });

        return { tabela, materiais };
      }
      if (!data.materiais) {
        return { tabela, materiais: [] };
      }

      const materiaisData = data.materiais.map((materialId, ind) => ({
        tabela_id: tabela.id,
        material_id: data.materiais[ind].id,
        preco_compra: data.materiais[ind].preco_compra,
      }));

      const materiais = await prisma.material_tabela.createMany({
        data: materiaisData,
      });

      return { tabela, materiais };
    });

    const tabelaCriada = await prisma.tabela.findUnique({
      where: {
        id: trx.tabela.id,
      },
      include: {
        materiais: {
          include: {
            material: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    return {
      id: tabelaCriada.id,
      nome: tabelaCriada.nome,
      materiais: tabelaCriada.materiais.map((materialTabela) => ({
        id: materialTabela.id,
        tabela_id: materialTabela.tabela_id,
        material_id: materialTabela.material_id,
        preco_compra: Number(materialTabela.preco_compra),
        atualizado_em: materialTabela.atualizado_em,
        nome_material: materialTabela.material.nome,
      })),
      criado_em: new Date(tabelaCriada.criado_em),
      atualizado_em: new Date(tabelaCriada.atualizado_em),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new NotFoundError("Um ou mais materiais informados não existem.");
      }
    }
    throw error;
  }
};
const findById = async (id) => {
  const tabela = await prisma.tabela.findUnique({
    where: {
      id,
    },
    include: {
      materiais: {
        include: {
          material: {
            select: {
              nome: true,
            },
          },
        },
      },
    },
  });

  if (!tabela) {
    throw new NotFoundError("Tabela não encontrada.");
  }

  return {
    id: tabela.id,
    nome: tabela.nome,
    materiais: tabela.materiais.map((materialTabela) => ({
      id: materialTabela.id,
      tabela_id: materialTabela.tabela_id,
      material_id: materialTabela.material_id,
      preco_compra: Number(materialTabela.preco_compra),
      atualizado_em: materialTabela.atualizado_em,
      nome_material: materialTabela.material.nome,
    })),
    criado_em: new Date(tabela.criado_em),
    atualizado_em: new Date(tabela.atualizado_em),
  };
};
const findAll = async () => {
  const tabelas = await prisma.tabela.findMany();

  return tabelas.map((tabela) => ({
    id: tabela.id,
    nome: tabela.nome,
    criado_em: new Date(tabela.criado_em),
    atualizado_em: new Date(tabela.atualizado_em),
  }));
};
const update = async (data, id) => {
  // Implementar lógica de update de tabela e materiais relacionados

  const tabelaAtual = await prisma.tabela.findUnique({
    where: {
      id,
    },
  });

  if (!tabelaAtual) {
    throw new NotFoundError(
      "Não foi possível encontrar a tabela com o id informado.",
    );
  }

  try {
    const trx = await prisma.$transaction(async () => {
      const tabelaAtualizada = await prisma.tabela.update({
        where: {
          id,
        },
        data: {
          nome: data.nome ? data.nome.toUpperCase() : tabelaAtual.nome,
          atualizado_em: new Date(),
          status: data.status !== undefined ? data.status : tabelaAtual.status,
        },
      });

      if (data.materiais) {
        await prisma.material_tabela.deleteMany({
          where: {
            tabela_id: id,
          },
        });

        const materiaisData = data.materiais.map((material) => ({
          tabela_id: id,
          material_id: material.id,
          preco_compra: material.preco_compra,
        }));

        await prisma.material_tabela.createMany({
          data: materiaisData,
        });
      }

      return tabelaAtualizada;
    });

    const tabelaAtualizada = await prisma.tabela.findUnique({
      where: {
        id: trx.id,
      },
      include: {
        materiais: {
          include: {
            material: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    return {
      id: tabelaAtualizada.id,
      nome: tabelaAtualizada.nome,
      materiais: tabelaAtualizada.materiais.map((materialTabela) => ({
        id: materialTabela.id,
        tabela_id: materialTabela.tabela_id,
        material_id: materialTabela.material_id,
        preco_compra: Number(materialTabela.preco_compra),
        atualizado_em: materialTabela.atualizado_em,
        nome_material: materialTabela.material.nome,
      })),
      criado_em: new Date(tabelaAtualizada.criado_em),
      atualizado_em: new Date(tabelaAtualizada.atualizado_em),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new NotFoundError("Um ou mais materiais informados não existem.");
      }
    }
    throw error;
  }
};
const deleteTab = async (id) => {
  try {
    if (id === 1) {
      throw new ValidationError("A tabela padrão não pode ser deletada.");
    }
    const tabelaAtual = await prisma.tabela.findUnique({
      where: {
        id,
      },
    });

    if (!tabelaAtual) {
      throw new NotFoundError(
        "Não foi possível encontrar a tabela com o id informado.",
      );
    }

    await prisma.material_tabela.deleteMany({
      where: {
        tabela_id: id,
      },
    });

    await prisma.tabela.delete({
      where: {
        id,
      },
    });

    return {};
  } catch (error) {
    throw error;
  }
};
const tabela = {
  create,
  findById,
  findAll,
  update,
  deleteTab,
};

export default tabela;
// {
//   nome: "tabela nova",
//   materiais: [
//     {
//       id: 1,
//       preco_compra: 10
//     },
//     {
//       id: 2,
//       preco_compra: 20
//     }
//   ]
// }
