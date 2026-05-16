import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/materiais", () => {
  describe("Usuario autenticado", () => {
    test("Sem materiais cadastrados", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/materiais", {
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
    test("Com materiais cadastrados", async () => {
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

      const response = await fetch("http://localhost:3000/api/v1/materiais", {
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
        id: material1.id,
        nome: "MATERIAL 01",
        categoria_id: categoria1.id,
        preco_venda: "20",
        categoria: {
          id: categoria1.id,
          nome: "CATEGORIA 01",
        },
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });

      expect(responseBody[1]).toEqual({
        id: material2.id,
        nome: "MATERIAL 02",
        categoria_id: categoria2.id,
        preco_venda: "30",
        categoria: {
          id: categoria2.id,
          nome: "CATEGORIA 02",
        },
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

      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 03",
        preco_venda: 20,
        categoria_id: categoria1.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL 04",
        preco_venda: 30,
        categoria_id: categoria2.id,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/materiais?nome=MATERIAL 03",
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
        id: material1.id,
        nome: "MATERIAL 03",
        categoria_id: categoria1.id,
        preco_venda: "20",
        categoria: {
          id: categoria1.id,
          nome: "CATEGORIA 03",
        },
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca por categoria", async () => {
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

      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 05",
        preco_venda: 20,
        categoria_id: categoria1.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL 06",
        preco_venda: 30,
        categoria_id: categoria2.id,
      });
      const material3 = await orchestrator.createMaterial({
        nome: "MATERIAL 07",
        preco_venda: 25,
        categoria_id: categoria2.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais?categoria_id=${categoria2.id}`,
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
      expect(responseBody).toHaveLength(2);

      expect(responseBody[0]).toEqual({
        id: material2.id,
        nome: "MATERIAL 06",
        categoria_id: categoria2.id,
        preco_venda: "30",
        categoria: {
          id: categoria2.id,
          nome: "CATEGORIA 6",
        },
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
        status: true,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca por categoria e nome", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const categoria1 = await orchestrator.createCategoria({
        nome: "CATEGORIA 7",
      });
      const categoria2 = await orchestrator.createCategoria({
        nome: "CATEGORIA 8",
      });

      const material1 = await orchestrator.createMaterial({
        nome: "MATERIAL 08",
        preco_venda: 20,
        categoria_id: categoria1.id,
      });
      const material2 = await orchestrator.createMaterial({
        nome: "MATERIAL 09",
        preco_venda: 30,
        categoria_id: categoria1.id,
      });
      const material3 = await orchestrator.createMaterial({
        nome: "Aluminio",
        preco_venda: 25,
        categoria_id: categoria2.id,
      });
      const material4 = await orchestrator.createMaterial({
        nome: "Ferro",
        preco_venda: 25,
        categoria_id: categoria2.id,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/materiais?categoria_id=${categoria2.id}&nome=A`,
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
        id: material3.id,
        nome: "ALUMINIO",
        categoria_id: categoria2.id,
        preco_venda: "25",
        categoria: {
          id: categoria2.id,
          nome: "CATEGORIA 8",
        },
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
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

      const response = await fetch("http://localhost:3000/api/v1/materiais", {
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
      const response = await fetch("http://localhost:3000/api/v1/materiais", {
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
