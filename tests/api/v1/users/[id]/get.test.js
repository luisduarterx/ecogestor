import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[id]", () => {
  describe("Usuario anonimo", () => {
    test("Com id válido", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "User Teste",
          email: "teste1@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "User Teste",
        email: "teste1@gmail.com",
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${responseBody.id}`,
      );

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: responseBody.id,
        nome: "User Teste",
        email: "teste1@gmail.com",
        senha: response2Body.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(response2.status).toBe(200);
    });
    test("Com id inválido", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/569a3edd-5b0f-4306-bcc8-51d0f4b89a3f",
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Não foi possivel encontrar esse usuário",
        action: "Tente novamente enviando um usuário válido",
        status_code: 400,
      });
      expect(response.status).toBe(400);
    });
  });
});
