import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/categorias-lancamento", () => {
  describe("Usuario autenticado", () => {
    test("Busca todas as categorias de lançamento", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const categoria0 = await orchestrator.createCategoriaLancamento({
        nome: "COMPRA DE SUCATA",
        tipo_categoria: "DESPESA",
      });
      const categoria1 = await orchestrator.createCategoriaLancamento({
        nome: "VENDA DE SUCATA",
        tipo_categoria: "RECEITA",
      });

      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/categorias-lancamento",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(2);
      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "COMPRA DE SUCATA",
        tipo_categoria: "DESPESA",
        criado_em: responseBody[0].criado_em,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca com parametro", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria0 = await orchestrator.createCategoriaLancamento({
        nome: "COMPRA DE SUCATA",
        tipo_categoria: "DESPESA",
      });
      const categoria1 = await orchestrator.createCategoriaLancamento({
        nome: "VENDA DE SUCATA",
        tipo_categoria: "RECEITA",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias-lancamento/?nome=COMPRA`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(1);
      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "COMPRA DE SUCATA",
        tipo_categoria: "DESPESA",
        criado_em: responseBody[0].criado_em,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
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
        "http://localhost:3000/api/v1/categorias-lancamento",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
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
  describe("Usuario não autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/categorias-lancamento",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
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
