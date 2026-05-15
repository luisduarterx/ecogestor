import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/categorias", () => {
  describe("Usuario autenticado", () => {
    test("Sem categorias cadastradas", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/categorias", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(0);

      expect(response.status).toBe(200);
    });
    test("Com categorias cadastradas", async () => {
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

      const response = await fetch("http://localhost:3000/api/v1/categorias", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);

      expect(responseBody[0]).toEqual({
        id: categoria1.id,
        nome: "CATEGORIA 01",
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });
      expect(responseBody[1]).toEqual({
        id: categoria2.id,
        nome: "CATEGORIA 02",
        criado_em: responseBody[1].criado_em,
        atualizado_em: responseBody[1].atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[1].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[1].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca por nome", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria1 = await orchestrator.createCategoria({
        nome: "CATEGORIA 03",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 04",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/categorias?nome=CATEGORIA 03",
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
      expect(responseBody).toHaveLength(1);

      expect(responseBody[0]).toEqual({
        id: categoria1.id,
        nome: "CATEGORIA 03",
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca por LETRA", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria1 = await orchestrator.createCategoria({
        nome: "CATEGORIA 5",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 6",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/categorias?nome=cat`,
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
      expect(responseBody).toHaveLength(6);

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca por categoria e ordenacao", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const categoria1 = await orchestrator.createCategoria({
        nome: "CATEGORIA 7",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/categorias?nome=CATEGORIA&ordem=asc`,
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
      expect(responseBody).toHaveLength(7);

      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "CATEGORIA 01",
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });
      expect(responseBody[6]).toEqual({
        id: responseBody[6].id,
        nome: "CATEGORIA 7",
        criado_em: responseBody[6].criado_em,
        atualizado_em: responseBody[6].atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

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

      const response = await fetch("http://localhost:3000/api/v1/categorias", {
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
      const response = await fetch("http://localhost:3000/api/v1/categorias", {
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
