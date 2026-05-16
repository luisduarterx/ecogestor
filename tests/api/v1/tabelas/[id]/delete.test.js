import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("DELETE /api/v1/tabelas/[id]", () => {
  describe("Usuario autenticado", () => {
    test("DELETA UMA TABELA EXISTENTE", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 10",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 11",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 27",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 28",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 29",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });

      const createdTabela = await orchestrator.createTabela({
        nome: "TABELA BASE",
        materiais: [
          {
            id: material1.id,
            preco_compra: 10,
          },
          {
            id: material3.id,
            preco_compra: 20,
          },
          { id: material4.id, preco_compra: 25 },
        ],
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/tabelas/${createdTabela.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({});

      expect(response.status).toBe(200);
    });
    test("Tentativa de deletar a tabela Padrão", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(`http://localhost:3000/api/v1/tabelas/1`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        message: "A tabela padrão não pode ser deletada.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });
    });
    test("Tentativa de deletar uma tabela inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/tabelas/9999`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody).toEqual({
        message: "Não foi possível encontrar a tabela com o id informado.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });
    });
  });
  describe("Usuario autenticado, sem permissao", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/tabelas/1", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({}),
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
  describe("Usuario não autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch("http://localhost:3000/api/v1/tabelas/1", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(),
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
