import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
});

describe("GET /api/v1/users/[id]", () => {
  describe("Usuario ADMIN Autenticado", () => {
    test("Com id válido", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "User Teste",
        email: "teste1@gmail.com",
        senha: "senha123",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          headers: {
            Cookie: `sid=${userSession.token}`,
          },
        },
      );

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: user.id,
        nome: "User Teste",
        email: "teste1@gmail.com",
        perfil_id: user.perfil_id,
        senha: response2Body.senha,
        criado_em: response2Body.criado_em,
        atualizado_em: response2Body.atualizado_em,
      });
      expect(response2.status).toBe(200);
    });
    test("Com id inválido", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const response = await fetch("http://localhost:3000/api/v1/users/5", {
        headers: {
          Cookie: `sid=${userSession.token}`,
        },
      });

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
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const response = await fetch(
        `http://localhost:3000/api/v1/users/qqwdqw`,
        {
          headers: {
            Cookie: `sid=${userSession.token}`,
          },
        },
      );

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
  describe("Usuario Não Autenticado", () => {
    test("Com id válido, sem cookie de sessão", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado6",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "User Teste",

        senha: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          headers: {},
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnAuthorizedError",
        message: "Acesso não autorizado.",
        action: "Você precisa estar autenticado para acessar esse recurso.",
        status_code: 401,
      });
      expect(response.status).toBe(401);
    });
    test("Com id válido, com cookie de sessão expirado", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSessionExpired(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "User Teste",

        senha: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          headers: {},
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnAuthorizedError",
        message: "Acesso não autorizado.",
        action: "Você precisa estar autenticado para acessar esse recurso.",
        status_code: 401,
      });
      expect(response.status).toBe(401);
    });
  });
  describe("Usuário Sem permissão", () => {
    test("Com id válido sem permissão de acesso", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
        perfil_id: 2,
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "User Teste",

        senha: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          headers: {
            Cookie: `sid=${userSession.token}`,
          },
        },
      );

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
});
