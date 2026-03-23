import { prisma } from "infra/database";
import crypto from "node:crypto";
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

const session = {
  create,
  expiration_in_miliseconds,
};

export default session;
