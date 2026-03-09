import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Usuario anonimo", () => {
    test("Email incorreto e senha correta", async () => {
      await orchestrator.createUser({
        nome: "Luis Claudio",
        senha: "senhaCorreta",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: "emailerrado@gmail.com",
          senha: "senhaCorreta",
        }),
      });
      const responseBody = await response.json();
      expect(response.status).toBe(401);
      expect(responseBody).toEqual({
        message: "Tente efetuar login com um email válido.",
        name: "UnAuthorizedError",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 401,
      });
    });
    test("Email correto e senha errada", async () => {
      await orchestrator.createUser({
        email: "senhaErrada@gmail.com",
        nome: "Luis Claudio",
        senha: "senhaCorreta",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: "senhaErrada@gmail.com",
          senha: "senhaErrada",
        }),
      });
      const responseBody = await response.json();
      expect(response.status).toBe(401);
      expect(responseBody).toEqual({
        message: "Erro durante a autenticação.",
        name: "UnAuthorizedError",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 401,
      });
    });
    test("Email e senha corretos", async () => {
      await orchestrator.createUser({
        email: "emailcorreto@gmail.com",
        nome: "Luis Claudio",
        senha: "senhaCorreta",
      });

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: "emailcorreto@gmail.com",
          senha: "senhaCorreta",
        }),
      });
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: responseBody.user_id,
        expira_em: responseBody.expira_em,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(uuidVersion(responseBody.id)).toBe(4); // verifica se o id é um UUID v4 válido
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN(); // verifica se não é um NAN
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
  });
});
