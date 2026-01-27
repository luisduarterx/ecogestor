import { faker } from "@faker-js/faker";
import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator.js";
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
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
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
  runPendingMigrations,
  createUser,
};

export default orchestrator;
