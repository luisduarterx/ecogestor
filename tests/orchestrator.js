import { faker } from "@faker-js/faker";
import retry from "async-retry";
import { prisma } from "infra/database";
import session from "models/session";
import crypto from "node:crypto";
import user from "models/user";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}
async function clearDatabase() {
  await prisma.sessions.deleteMany();

  await prisma.users.deleteMany();
}
async function seedDatabase() {
  const permissoes = ["create:user", "read:user", "update:user", "delete:user"];
  await prisma.perfis.upsert({
    where: {
      id: 1,
    },
    update: { permissoes },
    create: {
      nome: "Admin",
      permissoes,
    },
  });
}
async function createPerfilWithoutPermissions(permissoes) {
  await prisma.perfis.upsert({
    create: {
      nome: "SUP",
    },
    update: {},
    where: {
      id: 2,
    },
  });
}

async function createUser(userInputArguments) {
  return await user.create({
    nome: userInputArguments.nome,
    email: userInputArguments.email || faker.internet.email(),
    senha: userInputArguments.senha || "senhasegura",
    perfil_id: userInputArguments.perfil_id,
  });
}
async function createSession(userId) {
  const newSession = await session.create(userId);

  return newSession;
}
async function createSessionExpired(userId) {
  const token = crypto.randomBytes(48).toString("hex");

  const expiredDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hora atrás
  const sessionExpired = await prisma.sessions.create({
    data: { token, user_id: userId, expira_em: expiredDate },
  });

  console.log("SESISON EXPIRED:", sessionExpired);
  return sessionExpired;
}
const orchestrator = {
  waitForAllServices,
  clearDatabase,
  createUser,
  createSession,
  seedDatabase,
  createSessionExpired,
  createPerfilWithoutPermissions,
};

export default orchestrator;
