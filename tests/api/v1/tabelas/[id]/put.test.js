import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PUT /api/v1/tabelas/[id]", () => {
  describe("Usuario autenticado", () => {
    test("Atualiza uma tabela existente", async () => {
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

      const material5 = await orchestrator.createMaterial({
        nome: "MATERIAL 37",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });
      const material6 = await orchestrator.createMaterial({
        nome: "MATERIAL 38",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });

      const material7 = await orchestrator.createMaterial({
        nome: "MATERIAL 39",
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
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Tabela Atualizada",
            materiais: [
              { id: material1.id, preco_compra: 15 },
              {
                id: material5.id,
                preco_compra: 70,
              },
              {
                id: material6.id,
                preco_compra: 80,
              },
              {
                id: material7.id,
                preco_compra: 90,
              },
            ],
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA ATUALIZADA",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        materiais: [
          {
            id: responseBody.materiais[0].id,
            tabela_id: responseBody.id,
            material_id: material1.id,
            preco_compra: 15,
            atualizado_em: responseBody.materiais[0].atualizado_em,
            nome_material: "MATERIAL 27",
          },
          {
            id: responseBody.materiais[1].id,
            tabela_id: responseBody.id,
            material_id: material5.id,
            preco_compra: 70,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 37",
          },
          {
            id: responseBody.materiais[2].id,
            tabela_id: responseBody.id,
            material_id: material6.id,
            preco_compra: 80,
            atualizado_em: responseBody.materiais[2].atualizado_em,
            nome_material: "MATERIAL 38",
          },
          {
            id: responseBody.materiais[3].id,
            tabela_id: responseBody.id,
            material_id: material7.id,
            preco_compra: 90,
            atualizado_em: responseBody.materiais[3].atualizado_em,
            nome_material: "MATERIAL 39",
          },
        ],
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();

      expect(Date.parse(responseBody.materiais[2].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Tentativa de atualizar uma com materiais inválidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 12",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 13",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 70",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 71",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 72",
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
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Tabela Atualizada",
            materiais: [{ id: 98989, preco_compra: 15 }],
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Um ou mais materiais informados não existem.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
    });

    test("Tentativa de atualizar tabela inválida", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/tabelas/999999`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "TABELA FILHA DA BASE",
            base: 9999,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Não foi possível encontrar a tabela com o id informado.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
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
        method: "PUT",
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
        method: "PUT",
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
