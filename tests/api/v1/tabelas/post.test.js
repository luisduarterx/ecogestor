import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/tabelas", () => {
  describe("Usuario autenticado", () => {
    test("Criando uma tabela nova sem base criada", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 03",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 04",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 01",
        preco_venda: 20,
        categoria_id: categoria.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL 02",
        preco_venda: 30,
        categoria_id: categoria2.id,
      });
      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 03",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 04",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA NOVA",
          materiais: [
            {
              id: material1.id,
              preco_compra: 10,
            },
            {
              id: material2.id,
              preco_compra: 15,
            },
            {
              id: material3.id,
              preco_compra: 20,
            },
            {
              id: material4.id,
              preco_compra: 25,
            },
          ],
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA NOVA",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        materiais: [
          {
            id: responseBody.materiais[0].id,
            tabela_id: responseBody.id,
            material_id: material1.id,
            preco_compra: 10,
            atualizado_em: responseBody.materiais[0].atualizado_em,
            nome_material: "MATERIAL 01",
          },
          {
            id: responseBody.materiais[1].id,
            tabela_id: responseBody.id,
            material_id: material2.id,
            preco_compra: 15,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 02",
          },
          {
            id: responseBody.materiais[2].id,
            tabela_id: responseBody.id,
            material_id: material3.id,
            preco_compra: 20,
            atualizado_em: responseBody.materiais[2].atualizado_em,
            nome_material: "MATERIAL 03",
          },
          {
            id: responseBody.materiais[3].id,
            tabela_id: responseBody.id,
            material_id: material4.id,
            preco_compra: 25,
            atualizado_em: responseBody.materiais[3].atualizado_em,
            nome_material: "MATERIAL 04",
          },
        ],
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[2].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[3].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Tabela com material não encontrado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 05",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 06",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 09",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 11",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 12",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA NOVA",
          materiais: [
            {
              id: material1.id,
              preco_compra: 10,
            },
            {
              id: 9999,
              preco_compra: 15,
            },
            {
              id: material3.id,
              preco_compra: 20,
            },
            {
              id: material4.id,
              preco_compra: 25,
            },
          ],
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Um ou mais materiais informados não existem.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
    });
    test("Material com preço de compra inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 07",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 08",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 14",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 15",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 16",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA NOVA",
          materiais: [
            {
              id: material1.id,
              preco_compra: 0,
            },

            {
              id: material3.id,
              preco_compra: 20,
            },
            {
              id: material4.id,
              preco_compra: 25,
            },
          ],
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Um erro de validação ocorreu.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Criando uma tabela com tabela base, sem porcentagem", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 8",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 09",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 24",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 25",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 26",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA FILHA DA BASE",
          base: createdTabela.id,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA FILHA DA BASE",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        materiais: [
          {
            id: responseBody.materiais[0].id,
            tabela_id: responseBody.id,
            material_id: material1.id,
            preco_compra: 10,
            atualizado_em: responseBody.materiais[0].atualizado_em,
            nome_material: "MATERIAL 24",
          },
          {
            id: responseBody.materiais[1].id,
            tabela_id: responseBody.id,
            material_id: material3.id,
            preco_compra: 20,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 25",
          },
          {
            id: responseBody.materiais[2].id,
            tabela_id: responseBody.id,
            material_id: material4.id,
            preco_compra: 25,
            atualizado_em: responseBody.materiais[2].atualizado_em,
            nome_material: "MATERIAL 26",
          },
        ],
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();

      expect(Date.parse(responseBody.materiais[2].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Criando uma tabela com tabela base, com porcentagem", async () => {
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA FILHA DA BASE",
          base: createdTabela.id,
          porcentagem: 10,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA FILHA DA BASE",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        materiais: [
          {
            id: responseBody.materiais[0].id,
            tabela_id: responseBody.id,
            material_id: material1.id,
            preco_compra: 11,
            atualizado_em: responseBody.materiais[0].atualizado_em,
            nome_material: "MATERIAL 27",
          },
          {
            id: responseBody.materiais[1].id,
            tabela_id: responseBody.id,
            material_id: material3.id,
            preco_compra: 22,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 28",
          },
          {
            id: responseBody.materiais[2].id,
            tabela_id: responseBody.id,
            material_id: material4.id,
            preco_compra: 27.5,
            atualizado_em: responseBody.materiais[2].atualizado_em,
            nome_material: "MATERIAL 29",
          },
        ],
      });
      expect(responseBody.materiais[0].preco_compra).toBeCloseTo(11);
      expect(responseBody.materiais[1].preco_compra).toBeCloseTo(22);
      expect(responseBody.materiais[2].preco_compra).toBeCloseTo(27.5);
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();

      expect(Date.parse(responseBody.materiais[2].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Criando uma tabela com tabela base, com porcentagem negativa", async () => {
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
        nome: "MATERIAL 30",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 31",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 32",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA FILHA DA BASE",
          base: createdTabela.id,
          porcentagem: -10,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA FILHA DA BASE",
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        materiais: [
          {
            id: responseBody.materiais[0].id,
            tabela_id: responseBody.id,
            material_id: material1.id,
            preco_compra: 9,
            atualizado_em: responseBody.materiais[0].atualizado_em,
            nome_material: "MATERIAL 30",
          },
          {
            id: responseBody.materiais[1].id,
            tabela_id: responseBody.id,
            material_id: material3.id,
            preco_compra: 18,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 31",
          },
          {
            id: responseBody.materiais[2].id,
            tabela_id: responseBody.id,
            material_id: material4.id,
            preco_compra: 22.5,
            atualizado_em: responseBody.materiais[2].atualizado_em,
            nome_material: "MATERIAL 32",
          },
        ],
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();

      expect(Date.parse(responseBody.materiais[2].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Tentativa de criar tabela com materiais e base", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 18",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 19",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 34",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 35",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 36",
        preco_venda: 50,
        categoria_id: categoria2.id,
      });
      const material5 = await orchestrator.createMaterial({
        nome: "MATERIAL 37",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA FILHA DA BASE",
          base: createdTabela.id,
          materiais: [
            {
              id: material5.id,
              preco_compra: 70,
            },
          ],
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message:
          "Não é permitido informar materiais quando uma tabela base é informada.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Tentativa de criar tabela base inválida", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 20",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 21",
      });
      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 39",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 40",
        preco_venda: 40,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "MATERIAL 41",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "TABELA FILHA DA BASE",
          base: 9999,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message:
          "Tabela base informada não existe. Verifique os dados enviados e tente novamente.",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
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
      const response = await fetch("http://localhost:3000/api/v1/tabelas", {
        method: "POST",
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
