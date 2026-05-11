import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/materiais/[id]", () => {
  describe("Usuario autenticado", () => {
    test("Com dados válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 01",
      });
      const material = await orchestrator.createMaterial({
        nome: "MATERIAL 01",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/${material.id}`,
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
        id: responseBody.id,
        nome: material.nome,
        categoria_id: material.categoria_id,
        preco_venda: material.preco_venda.toString(),
        categoria: {
          id: material.categoria_id,
          nome: categoria.nome,
        },
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Com id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/132`,
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
        message: "Não foi possível encontrar o material com o id informado.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
    });
    test("Com id inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/invalid-id`,
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
      const response = await fetch("http://localhost:3000/api/v1/materiais/1", {
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
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/materiais/98999999",
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
