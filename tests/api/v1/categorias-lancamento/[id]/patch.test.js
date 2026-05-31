import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PATCH /api/v1/categorias-lancamento/[id]", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoriaLancamento({
        nome: "CATEGORIA 01",
        tipo_categoria: "DESPESA",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias-lancamento/${categoria.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CATEGORIA NOVA",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "CATEGORIA NOVA",
        tipo_categoria: "DESPESA",
        criado_em: responseBody.criado_em,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });

    test("Com nome duplicado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoriaLancamento({
        nome: "CATEGORIA 02",
        tipo_categoria: "DESPESA",
      });
      await orchestrator.createCategoriaLancamento({
        nome: "CATEGORIA 03",
        tipo_categoria: "DESPESA",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/categorias-lancamento/${categoria.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CATEGORIA 03",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "A categoria de lançamento já existe.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com nome duplicado e tipo de categoria diferente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoriaLancamento({
        nome: "CATEGORIA 02",
        tipo_categoria: "RECEITA",
      });
      await orchestrator.createCategoriaLancamento({
        nome: "CATEGORIA 03",
        tipo_categoria: "DESPESA",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/categorias-lancamento/${categoria.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CATEGORIA 03",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: categoria.id,
        nome: "CATEGORIA 03",
        tipo_categoria: "RECEITA",
        criado_em: responseBody.criado_em,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Com id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/categorias-lancamento/323`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CATEGORIA 03",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Categoria de lançamento não encontrada.",
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
        `http://localhost:3000/api/v1/categorias-lancamento/invalid-id`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CATEGORIA 03",
          }),
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
        "http://localhost:3000/api/v1/categorias-lancamento/99999",
        {
          method: "PATCH",
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
        "http://localhost:3000/api/v1/categorias-lancamento/98999999",
        {
          method: "PATCH",
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
