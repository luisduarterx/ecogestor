import { prisma } from "infra/database";
import { ValidationError } from "infra/errors";

const create = async (data) => {
  const existingRegistro = await prisma.registros.findFirst({
    where: {
      OR: [{ cpf: data.cpf }, { cnpj: data.cnpj }],
    },
  });

  if (existingRegistro) {
    throw new ValidationError("O registro informado já existe.");
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
    },
  });

  return newRegistro;
};

const registro = {
  create,
};

export default registro;
