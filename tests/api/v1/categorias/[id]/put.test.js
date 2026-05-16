import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PUT /api/v1/categorias", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "Cat Teste 1",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias/${categoria.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Nome atualizado",
            status: false,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "NOME ATUALIZADO",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        status: false,
      });
      expect(responseBody.atualizado_em > responseBody.criado_em).toBe(true);
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Com categoria já existente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria2 = await orchestrator.createCategoria({
        nome: "nome existente",
      });

      const categoria = await orchestrator.createCategoria({
        nome: "Cat Teste 2",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/categorias/${categoria.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "nome existente",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Essa categoria já existe.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com categoria inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias/99999`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "ABCDEF",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Não foi possível encontrar a categoria com o id informado.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
    });
    test("Sem body dentro da request", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });

      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "Cat Teste 3",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias/${categoria.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({}),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Um erro de validação ocorreu.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        "http://localhost:3000/api/v1/categorias/99999",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Plasticos",
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
  describe("Usuario não autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/categorias/98999999",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            nome: "Aluminios",
          }),
        },
      );

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
