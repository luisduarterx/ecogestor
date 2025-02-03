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
  const user = await prisma.user.create({
    data: {
      name,
      email,
      senha,
      telefone,
      rankID,
    },
  });
  console.log(user);
};
export const findUserByID = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });

    return user;
  } catch (error) {
    console.log("nao identificado");
    return error;
  }
};
