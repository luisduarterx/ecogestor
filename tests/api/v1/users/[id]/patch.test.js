import password from "models/password";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
});

describe("PATCH /api/v1/users/[id]", () => {
  describe("Usuario Autenticado", () => {
    test("Com dados e id validos", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado1",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
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
            Cookie: `sid=${userSession.token}`,
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
        perfil_id: user.perfil_id,
        senha: responseBody.senha,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(responseBody.atualizado_em > responseBody.criado_em).toBe(true);
    });
    test("Com email duplicado", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado2",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
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
            Cookie: `sid=${userSession.token}`,
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
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado3",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
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
            Cookie: `sid=${userSession.token}`,
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
        perfil_id: responseBody.perfil_id,
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
    test("Com id NaN", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado4",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const response = await fetch(`http://localhost:3000/api/v1/users/dfsdf`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${userSession.token}`,
        },
        body: JSON.stringify({
          senha: "senhasegura2",
        }),
      });

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
    test("Com dados e id validos, sem cookie de sessão", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "Testador",
        email: "test-5@gmail.com",
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

      expect(response.status).toEqual(401);
      expect(responseBody).toEqual({
        name: "UnAuthorizedError",
        message: "Acesso não autorizado.",
        action: "Você precisa estar autenticado para acessar esse recurso.",
        status_code: 401,
      });
    });
    test("Com dados e id validos, com cookie de sessão expirado", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado5",
        senha: "senha123",
      });
      const userSession = await orchestrator.createSessionExpired(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "Testador",
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

      expect(response.status).toEqual(401);
      expect(responseBody).toEqual({
        name: "UnAuthorizedError",
        message: "Acesso não autorizado.",
        action: "Você precisa estar autenticado para acessar esse recurso.",
        status_code: 401,
      });
    });
  });
  describe("Usuário sem permissão", () => {
    test("Com dados e id validos, sem permissão de acesso", async () => {
      const usuarioAutenticado = await orchestrator.createUser({
        nome: "UsuarioAutenticado1",
        senha: "senha123",
        perfil_id: 2,
      });
      const userSession = await orchestrator.createSession(
        usuarioAutenticado.id,
      );
      const user = await orchestrator.createUser({
        nome: "Testador",
        senha: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${userSession.token}`,
          },
          body: JSON.stringify({
            nome: "Testador2",
          }),
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
