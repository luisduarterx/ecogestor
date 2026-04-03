import { prisma } from "infra/database";
import crypto from "node:crypto";
import user from "./user";
const expiration_in_miliseconds = 60 * 60 * 24 * 1 * 1000; // 1 dia
const create = async (userId) => {
  const token = crypto.randomBytes(48).toString("hex");

  const expiresAt = new Date(Date.now() + expiration_in_miliseconds);

  console.log("token: ", token);

  const newSession = await insertQuery(token, userId, expiresAt);
  return newSession;
  async function insertQuery(token, userId, expiresAt) {
    const result = await prisma.sessions.create({
      data: { token, user_id: userId, expira_em: expiresAt },
    });

    console.log("SESISON:", result);
    return result;
  }
};
const validateAndReturnUser = async (token) => {
  const session = await prisma.sessions.findUnique({
    where: { token },
  });

  if (!session) {
    return null;
  }

  if (session.expira_em < new Date()) {
    await prisma.sessions.delete({
      where: { id: session.id },
    });

    return null;
  }
  const userValid = await prisma.users.findUnique({
    where: { id: session.user_id },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: { select: { nome: true, permissoes: true } },
    },
  });

  if (!userValid) {
    await prisma.sessions.delete({
      where: { id: session.id },
    });
    return null;
  }

  return userValid;
};

const session = {
  create,
  expiration_in_miliseconds,
  validateAndReturnUser,
};

export default session;
