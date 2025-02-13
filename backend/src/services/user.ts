import { prisma } from "../libs/prismaClient";
import jwt from "jsonwebtoken";

type credenciaisEntrada = {
  email: string;
  senha: string;
};

export const generateToken = (id: number) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, process.env.JWT_KEY as string);
};
export const findUserByEmailAndPassword = async ({
  email,
  senha,
}: credenciaisEntrada) => {
  const user = await prisma.user.findMany({
    where: {
      email: email,
      senha: senha,
    },
  });
  if (user) {
    console.log(user);
    return user[0];
  } else {
    return undefined;
  }
};
type User = {
  name: string;
  email: string;
  senha: string;
  telefone: string;
  rankID: number;
};
export const createUser = async ({
  name,
  email,
  senha,
  telefone,
  rankID,
}: User) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        senha,
        telefone,
        rankID,
      },
    });
    return {
      message: "usuario criado com sucesso",
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const findUserByID = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return null;
    }
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      rankID: user?.rankID,
    };
  } catch (error) {
    console.log("nao identificado");
    return error;
  }
};

export const showUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    return error;
  }
};

export const editUser = async ({ id, data }: { id: number; data: User }) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      console.log("Nao existe");
      throw new Error("Usuario nao encontrado");
    }

    const userAtt = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return userAtt;
  } catch (error) {
    return error;
  }
};
export const deleteUser = async (id: number) => {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
      console.log("n ada");
      throw new Error("Usuario nao encontrado");
    }
    return user;
  } catch (error) {
    return error;
  }
};
