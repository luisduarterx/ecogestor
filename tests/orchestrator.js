import { faker } from "@faker-js/faker";
import retry from "async-retry";
import { prisma } from "infra/database";

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

async function createUser(userInputArguments) {
  return await user.create({
    nome: userInputArguments.nome,
    email: userInputArguments.email || faker.internet.email(),
    senha: userInputArguments.senha || "senhasegura",
  });
}
const orchestrator = {
  waitForAllServices,
  clearDatabase,
  createUser,
};

export default orchestrator;
