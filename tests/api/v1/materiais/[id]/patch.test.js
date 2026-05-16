import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PATCH /api/v1/materiais/[id]", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
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
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 02",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/${material.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "MATERIAL EDITADO",
            preco_venda: 250,
            categoria_id: categoria2.id,
            status: false,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "MATERIAL EDITADO",
        categoria_id: categoria2.id,
        preco_venda: "250",
        categoria: {
          id: categoria2.id,
          nome: "CATEGORIA 02",
        },
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        status: false,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Com nome duplicado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 03",
      });
      const material = await orchestrator.createMaterial({
        nome: "MATERIAL 01",
        preco_venda: 20,
        categoria_id: categoria.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL EDITADO",
        preco_venda: 30,
        categoria_id: categoria.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/${material.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "MATERIAL EDITADO",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "O material já existe.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com categoria_id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 04",
      });
      const material = await orchestrator.createMaterial({
        nome: "MATERIAL 04",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/${material.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            categoria_id: 9999,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "A categoria informada não existe.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com categoria_id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 06",
      });
      const material = await orchestrator.createMaterial({
        nome: "MATERIAL 05",
        preco_venda: 20,
        categoria_id: categoria.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/${material.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            preco_venda: -10,
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
    test("Com id inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/materiais/invalid-id`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "MATERIAL EDITADO",
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
        "http://localhost:3000/api/v1/materiais/99999",
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
        "http://localhost:3000/api/v1/materiais/98999999",
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
