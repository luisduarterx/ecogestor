import caixa from "models/caixa";
import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/financeiro/transferencias", () => {
  describe("Usuario autenticado", () => {
    test("Entre duas contas válidas, com valor válido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta1 = await orchestrator.createConta({
        nome: "CONTA ORIGEM",
        saldo_inicial: 1000,
      });
      const conta2 = await orchestrator.createConta({
        nome: "CONTA DESTINO",
        saldo_inicial: 1000,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            conta_origem_id: conta1.id,
            conta_destino_id: conta2.id,
            valor: 100,
            descricao: "Transferencia teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_origem_id: conta1.id,
        conta_destino_id: conta2.id,
        valor: 100,
        user_id: user.id,
        descricao: "Transferencia teste",
        caixa_id: null,
        criado_em: responseBody.criado_em,
      });

      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Entre duas contas válidas, com valor inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta1 = await orchestrator.createConta({
        nome: "CONTA ORIGEM",
        saldo_inicial: 1000,
      });
      const conta2 = await orchestrator.createConta({
        nome: "CONTA DESTINO",
        saldo_inicial: 1000,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            conta_origem_id: conta1.id,
            conta_destino_id: conta2.id,
            valor: 0,
            descricao: "Transferencia teste",
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
    test("Uma das contas inexistente, com valor válido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta2 = await orchestrator.createConta({
        nome: "CONTA DESTINO",
        saldo_inicial: 1000,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            conta_origem_id: 9999,
            conta_destino_id: conta2.id,
            valor: 100,
            descricao: "Transferencia teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Conta não encontrada",
        name: "NotFoundError",
        status_code: 404,
        action: "A conta de origem ou destino não existe.",
      });

      expect(response.status).toBe(404);
    });
    test("Uma Conta padrao com caixa fechado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const conta1 = await orchestrator.createConta({
        nome: "CONTA ORIGEM",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const conta2 = await orchestrator.createConta({
        nome: "CONTA DESTINO",
        saldo_inicial: 1000,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            conta_origem_id: conta1.id,
            conta_destino_id: conta2.id,
            valor: 100,
            descricao: "Transferencia teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message:
          "Não é possível movimentar a conta padrão sem um caixa aberto.",
        name: "ApplicationError",
        status_code: 409,
        action: "Abra o caixa antes de realizar movimentações na conta padrão.",
      });

      expect(response.status).toBe(409);
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
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            conta_origem_id: 1,
            conta_destino_id: 2,
            valor: 100,
          }),
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
        "http://localhost:3000/api/v1/financeiro/transferencias",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            conta_origem_id: 1,
            conta_destino_id: 2,
            valor: 100,
          }),
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
