import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Usuario anonimo", () => {
    test("Com dados unicos e válidos", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          email: "luiscdradm@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "Luis CLaudio Duarte",
        email: "luiscdradm@gmail.com",
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Com email já existente", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          email: "Luiscdradm@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Não é possivel criar um usuário com um email já cadastrado.",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 400,
      });
      expect(response.status).toEqual(400);
    });
  });
});
