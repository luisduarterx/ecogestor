import password from "models/password";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[id]", () => {
  describe("Usuario anonimo", () => {
    test("Com dados e id validos", async () => {
      const user = await orchestrator.createUser({
        nome: "Testador",
        email: "test-1@gmail.com",
        senha: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            nome: "Testador2",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toEqual(200);
      expect(responseBody).toEqual({
        id: user.id,
        nome: "Testador2",
        email: "test-1@gmail.com",
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(responseBody.atualizado_em > responseBody.criado_em).toBe(true);
    });
    test("Com email duplicado", async () => {
      const user = await orchestrator.createUser({
        nome: "EmailDuplicado",
        email: "test-2@gmail.com",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: "test-1@gmail.com",
          }),
        },
      );

      const response2Body = await response2.json();

      // expect(response2.status).toEqual(400);
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já esta sendo utilizado.",
        action: "Utilize outro email para realizar essa operação.",
        status_code: 400,
      });
    });
    test("Com nova senha", async () => {
      const user = await orchestrator.createUser({
        nome: "senhasegura1",
        senha: "senhasegura1",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            senha: "senhasegura2",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toEqual(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: responseBody.nome,
        email: responseBody.email,
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(responseBody.atualizado_em > responseBody.criado_em).toBe(true);

      expect(
        await password.compare({
          senha: "senhasegura2",
          hash: responseBody.senha,
        }),
      ).toBe(true);
    });
  });
});
