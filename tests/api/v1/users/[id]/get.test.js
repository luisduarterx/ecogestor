import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/users/[id]", () => {
  describe("Usuario anonimo", () => {
    test("Com id válido", async () => {
      const user = await orchestrator.createUser({
        nome: "User Teste",
        email: "teste1@gmail.com",
        senha: "senha123",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
      );

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: user.id,
        nome: "User Teste",
        email: "teste1@gmail.com",
        senha: response2Body.senha,
        criado_em: response2Body.criado_em,
        atualizado_em: response2Body.atualizado_em,
      });
      expect(response2.status).toBe(200);
    });
    test("Com id inválido", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/5");

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Não foi possivel encontrar esse usuário",
        action: "Tente novamente enviando um usuário válido",
        status_code: 404,
      });
      expect(response.status).toBe(404);
    });
    test("Com id NaN", async () => {
      const response = await fetch(`http://localhost:3000/api/v1/users/qqwdqw`);

      const responseBody = await response.json();

      expect(response.status).toEqual(400);
      expect(responseBody).toEqual({
        action: "Verifique os dados enviados e tente novamente.",
        message: "ID do usuário inválido.",
        name: "ValidationError",
        status_code: 400,
      });
    });
  });
});
