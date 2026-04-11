import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/users", () => {
  describe("Usuario autenticado", () => {
    test("Com dados unicos e válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 1",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
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
        perfil_id: responseBody.perfil_id,
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Com email já existente", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 2",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
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
    test("Sem body dentro da request", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 3",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Um erro de validação ocorreu.",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 400,
      });
      expect(response.status).toEqual(400);
    });
    test("Com dados unicos e válidos, sem permissão de acesso", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 1",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          email: "fakeEmail@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Acesso não autorizado.",
        name: "UnAuthorizedError",
        status_code: 401,
        action: "Você não tem permissão para acessar esse recurso.",
      });

      expect(response.status).toBe(401);
    });
  });
  describe("Usuário não autenticado", () => {
    test("Com dados unicos e válidos, sem cookie de sessão", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 1",
        perfil_id: 1,
      });

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
        message: "Acesso não autorizado.",
        name: "UnAuthorizedError",
        status_code: 401,
        action: "Você precisa estar autenticado para acessar esse recurso.",
      });

      expect(response.status).toBe(401);
    });
    test("Com dados unicos e válidos, com cookie de sessão expirado", async () => {
      const user = await orchestrator.createUser({
        nome: "Padrão de teste 1",
      });
      const session = await orchestrator.createSessionExpired(user.id);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          email: "fakeEmail@gmail.com",
          senha: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Acesso não autorizado.",
        name: "UnAuthorizedError",
        status_code: 401,
        action: "Você precisa estar autenticado para acessar esse recurso.",
      });

      expect(response.status).toBe(401);
    });
  });
});
