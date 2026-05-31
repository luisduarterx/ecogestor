import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/contas", () => {
  describe("Usuario autenticado", () => {
    test("Busca todas as contas", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const conta0 = await orchestrator.createConta({
        nome: "DINHEIRO",
        saldo_inicial: 1000,
      });
      const conta1 = await orchestrator.createConta({
        nome: "BANCO 1",
        saldo_inicial: 5000,
      });
      const conta2 = await orchestrator.createConta({
        nome: "BANCO 2",
        saldo_inicial: 2000,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/contas", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "BANCO 1",
        saldo_inicial: 5000,
        saldo_atual: 5000,
        status: true,
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca com parametro", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "DINHEIRO",
        saldo_inicial: 1000,
      });
      const conta2 = await orchestrator.createConta({
        nome: "BANCO 2",
        saldo_inicial: 2000,
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/contas/?nome=DIN`,
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
      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "DINHEIRO",
        saldo_inicial: 1000,
        saldo_atual: 1000,
        status: true,
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca em ordem decrescente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta = await orchestrator.createConta({
        nome: "CONTA 1",
        saldo_inicial: 1000,
      });
      const conta2 = await orchestrator.createConta({
        nome: "CONTA 2",
        saldo_inicial: 1000,
      });
      const conta3 = await orchestrator.createConta({
        nome: "CONTA 3",
        saldo_inicial: 1000,
      });
      const response = await fetch(
        "http://localhost:3000/api/v1/contas?ordem=desc",
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
      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        nome: "CONTA 3",
        saldo_inicial: 1000,
        saldo_atual: 1000,
        status: true,
        criado_em: responseBody[0].criado_em,
        atualizado_em: responseBody[0].atualizado_em,
      });

      expect(Date.parse(responseBody[0].criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody[0].atualizado_em)).not.toBeNaN();

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

      const response = await fetch("http://localhost:3000/api/v1/contas", {
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
      const response = await fetch("http://localhost:3000/api/v1/contas", {
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
