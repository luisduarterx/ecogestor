import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PATCH /api/v1/contas/[id]", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/contas/${conta.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CONTA NOVA",
            status: false,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "CONTA NOVA",
        saldo_inicial: 1000,
        saldo_atual: 1000,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
        status: false,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Altera apenas status", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/contas/${conta.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            status: false,
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "CONTA 01",
        saldo_inicial: 1000,
        saldo_atual: 1000,
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

      const conta = await orchestrator.createConta({
        nome: "CONTA 02",
        saldo_inicial: 1000,
      });
      await orchestrator.createConta({
        nome: "CONTA 03",
        saldo_inicial: 1000,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/contas/${conta.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CONTA 03",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "A conta já existe.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Com id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(`http://localhost:3000/api/v1/contas/323`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "CONTA 03",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Não foi possível encontrar a conta com o id informado.",
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
        `http://localhost:3000/api/v1/contas/invalid-id`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "CONTA 03",
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
        "http://localhost:3000/api/v1/contas/99999",
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
        "http://localhost:3000/api/v1/contas/98999999",
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
