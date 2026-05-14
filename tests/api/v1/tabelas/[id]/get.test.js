import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/tabelas", () => {
  describe("Usuario autenticado", () => {
    test("Tabela não encontrada", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/tabelas/12", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action: "Verifique os dados enviados e tente novamente.",
        message: "Tabela não encontrada.",
        name: "NotFoundError",
        status_code: 404,
      });
      expect(response.status).toBe(404);
    });
    test("Tabela válida", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria1 = await orchestrator.createCategoria({
        nome: "CATEGORIA 01",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 02",
      });

      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 01",
        preco_venda: 20,
        categoria_id: categoria1.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL 02",
        preco_venda: 30,
        categoria_id: categoria2.id,
      });
      const createdTabela = await orchestrator.createTabela({
        nome: "TABELA 01",
        materiais: [
          {
            id: material1.id,
            preco_compra: 10,
          },
          {
            id: material2.id,
            preco_compra: 20,
          },
        ],
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/tabelas/${createdTabela.id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(false);

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "TABELA 01",
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
            preco_compra: 20,
            atualizado_em: responseBody.materiais[1].atualizado_em,
            nome_material: "MATERIAL 02",
          },
        ],
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.materiais[0].atualizado_em)).not.toBeNaN();

      expect(Date.parse(responseBody.materiais[1].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Tentativa de acesso", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/tabelas/1", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
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
    test("Tentativa de acesso", async () => {
      const response = await fetch("http://localhost:3000/api/v1/tabelas/1", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
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
