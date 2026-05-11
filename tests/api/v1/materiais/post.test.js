import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/materiais", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 01",
      });
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "MATERIAL 01",
          preco_venda: 20,
          categoria_id: categoria.id,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "MATERIAL 01",
        categoria_id: categoria.id,
        preco_venda: "20",
        categoria: {
          id: categoria.id,
          nome: "CATEGORIA 01",
        },
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Com nome duplicado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 02",
      });
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "MAterial 01",
          preco_venda: 20,
          categoria_id: categoria.id,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "O material já existe",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com nome inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 03",
      });
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "AB",
          preco_venda: 20,
          categoria_id: categoria.id,
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
    test("Sem body dentro da request", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({}),
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
    test("Com categoria_id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "MAterial 02",
          preco_venda: 20,
          categoria_id: 9999,
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "A categoria informada não existe.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(404);
    });
    test("Com preço de venda negativo", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 04",
      });
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "MAterial 03",
          preco_venda: -10,
          categoria_id: categoria.id,
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
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);
      const categoria = await orchestrator.createCategoria({
        nome: "CATEGORIA 05",
      });
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "MAterial 01",
          preco_venda: 20,
          categoria_id: categoria.id,
        }),
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
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "MAterial 01",
          preco_venda: 20,
          categoria_id: 2,
        }),
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
