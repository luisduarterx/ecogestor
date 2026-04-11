import {
  NotFoundError,
  UnAuthorizedError,
  ValidationError,
} from "infra/errors";
import password from "./password";
import { prisma } from "infra/database";

const create = async (userInputValues) => {
  await password.hash(userInputValues);

  const userExist = await findUserByEmail(userInputValues.email);
  if (userExist) {
    throw new ValidationError(
      "Não é possivel criar um usuário com um email já cadastrado.",
    );
  }

  const result = await prisma.users.create({
    data: {
      email: userInputValues.email,
      nome: userInputValues.nome,
      senha: userInputValues.senha,
      perfil_id: userInputValues.perfil_id ? userInputValues.perfil_id : 1,
    },
  });

  return result;
};

const findUserByEmail = async (email) => {
  const result = await prisma.users.findFirst({
    where: {
      email: email.toLowerCase(),
    },
  });

  return result;
};
const findUserByID = async (id) => {
  const result = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new NotFoundError(
      "Não foi possivel encontrar esse usuário",
      "Tente novamente enviando um usuário válido",
    );
  }

  return result;
};

const update = async (id, userInputValues) => {
  const currentUser = await findUserByID(id);

  if (userInputValues.email) {
    const uniqueEmail = await findUserByEmail(userInputValues.email);

    if (uniqueEmail) {
      throw new ValidationError(
        "O email informado já esta sendo utilizado.",
        "Utilize outro email para realizar essa operação.",
      );
    }
  }
  if (userInputValues.senha) {
    userInputValues = await password.hash(userInputValues);
  }
  const newUser = await prisma.users.update({
    where: {
      id,
    },
    data: {
      nome: userInputValues.nome || currentUser.nome,
      email: userInputValues.email || currentUser.email,
      senha: userInputValues.senha || currentUser.senha,
      atualizado_em: new Date(),
    },
  });

  return newUser;
};
const user = {
  create,
  findUserByID,
  update,
  findUserByEmail,
};

export default user;
