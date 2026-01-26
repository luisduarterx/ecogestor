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
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "Testador",
          email: "test-1@gmail.com",
          senha: "senha123",
        }),
      });
      expect(response.status).toEqual(201);
      const responseBody = await response.json();

      const responsePatch = await fetch(
        `http://localhost:3000/api/v1/users/${responseBody.id}`,
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

      const responsePatchBody = await responsePatch.json();

      expect(responsePatch.status).toEqual(200);
      expect(responsePatchBody).toEqual({
        id: responseBody.id,
        nome: "Testador2",
        email: "test-1@gmail.com",
        senha: responseBody.senha,
        criado_em: responsePatchBody.criado_em,
        atualizado_em: responsePatchBody.atualizado_em,
      });
      expect(
        responsePatchBody.atualizado_em > responsePatchBody.criado_em,
      ).toBe(true);
    });
    test("Com email duplicado", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "Testador 2",
          email: "test-2@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${responseBody.id}`,
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
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "senhasegura1",
          email: "senhasegura1@gmail.com",
          senha: "senhasegura1",
        }),
      });
      expect(response.status).toEqual(201);
      const responseBody = await response.json();

      const responsePatch = await fetch(
        `http://localhost:3000/api/v1/users/${responseBody.id}`,
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

      const responsePatchBody = await responsePatch.json();

      expect(responsePatch.status).toEqual(200);
      expect(responsePatchBody).toEqual({
        id: responseBody.id,
        nome: responsePatchBody.nome,
        email: responsePatchBody.email,
        senha: responsePatchBody.senha,
        criado_em: responsePatchBody.criado_em,
        atualizado_em: responsePatchBody.atualizado_em,
      });
      expect(
        responsePatchBody.atualizado_em > responsePatchBody.criado_em,
      ).toBe(true);

      expect(
        await password.compare({
          senha: "senhasegura2",
          hash: responsePatchBody.senha,
        }),
      ).toBe(true);
    });
  });
});
