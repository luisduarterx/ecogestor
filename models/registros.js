import { tipo_registro } from "@prisma/client";
import { prisma } from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

const create = async (data) => {
  const existingRegistro = await prisma.registros.findFirst({
    where: {
      OR: [{ cpf: data.cpf }, { cnpj: data.cnpj }],
    },
  });
  if (!data.cpf && !data.cnpj) {
    throw new ValidationError(
      "Você precisa informar um CPF ou CNPJ para criar um registro.",
    );
  }

  if (existingRegistro) {
    throw new ValidationError("O registro informado já existe.");
  }
  if (data.cpf && data.cnpj) {
    throw new ValidationError(
      "Você precisa definir o tipo de registro(PF ou PJ).",
    );
  }

  const newRegistro = await prisma.registros.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      tipo_registro: data.tipo_registro,
      data_nascimento: data.data_nascimento
        ? new Date(data.data_nascimento)
        : null,
      tabela_id: data.tabela_id || 1,
      whatsapp: data.whatsapp,
      cnpj: data.cnpj,
      ie: data.ie,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      status: data.status ?? true,
    },
  });

  return newRegistro;
};
const update = async (data, id) => {
  if (data.cpf && data.cnpj) {
    throw new ValidationError(
      "Você não pode ter um registro com CPF e CNPJ ao mesmo tempo.",
    );
  }
  const existingRegistro = await prisma.registros.findUnique({
    where: {
      id: id,
    },
  });
  if (!existingRegistro) {
    throw new ValidationError("Registro não encontrado.");
  }
  const registroWithSameCpf = await prisma.registros.findFirst({
    where: {
      OR: [{ cpf: data.cpf }, { cnpj: data.cnpj }],
      NOT: {
        id: id, // Exclui o registro atual da busca
      },
    },
  });

  if (registroWithSameCpf) {
    throw new ValidationError(
      "O CPF ou CNPJ informado já está em uso por outro registro.",
    );
  }

  const updatedRegistro = await prisma.registros.update({
    where: {
      id: id,
    },
    data: {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      tipo_registro: data.tipo_registro,
      data_nascimento: data.data_nascimento
        ? new Date(data.data_nascimento)
        : null,
      whatsapp: data.whatsapp,
      cnpj: data.cnpj,
      ie: data.ie,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      status: data.status,
      atualizado_em: new Date(),
    },
  });
  return updatedRegistro;
};
const findAll = async (filtros) => {
  try {
    //futuramente mudar o where para fora da chamada ao banco
    const offset = (filtros.page - 1) * filtros.limit;

    filtros.status = filtros.status == "false" ? false : true;
    const registros = await prisma.registros.findMany({
      where: {
        status: filtros.status,

        ...(filtros.tipo && {
          tipo_registro: filtros.tipo,
        }),
        ...(filtros.search && {
          OR: [
            {
              nome: {
                contains: filtros.search,
                mode: "insensitive",
              },
            },
            {
              cpf: {
                contains: filtros.search,
              },
            },
            {
              cnpj: {
                contains: filtros.search,
              },
            },
          ],
        }),
      },

      skip: offset,
      take: Number(filtros.limit),
    });

    return registros;
  } catch (error) {
    console.log("O ERRO FOI ESSE", error);
    throw error;
  }
};
const findById = async (id) => {
  const registroFound = await prisma.registros.findUnique({
    where: {
      id: id,
    },
  });
  if (!registroFound) {
    throw new NotFoundError(
      "Registro não encontrado.",
      "O registro que você está tentando acessar não existe ou foi removido.",
    );
  }
  return registroFound;
};

const registro = {
  create,
  update,
  findAll,
  findById,
};

export default registro;
